import {KetshapEmbed} from "../EmbedGitHub.js";
import {EmbedBuilder, Message, APIEmbed} from "discord.js";
import {GitHubUtils} from "../../utils/github.js";
import {logger} from "../../logger/winston.js";
import {StringUtil} from "../../utils/string.js";
import {DiscordUtils} from "../../utils/discord.js";
import * as Sentry from '@sentry/node';
import {includeComment} from "./Comment.js";

export const Issues: KetshapEmbed = {
    name: 'issue',
    regex: /^https:\/\/github\.com\/(?<owner>[a-zA-z-_.0-9]+)\/(?<repo>[a-zA-z-_.0-9]+)\/issues\/(?<issue>\d+)(?:#issuecomment-(?<comment>\d+))?\/?$/,
    on: on
}

async function on(message: Message, match: RegExpMatchArray) {
    const matched = {
        owner: match.groups!['owner'],
        repo: match.groups!['repo'],
        issue: Number.parseInt(match.groups!['issue']),
        comment: match.groups!['comment']
    }

    logger.info('Attempting to request issue %s', matched)
    try {
        const result = await GitHubUtils.requestIssue(matched.owner, matched.repo, matched.issue)
        const [cached, issue] = [result.cached, result.data]
        if (issue == null) {
            return null
        }
        const image = GitHubUtils.issueImage(matched.owner, matched.repo, matched.issue)
        const embed = new EmbedBuilder().setImage(image)

        const body = issue.body == null ? null : StringUtil.limit(issue.body, 200)

        let description = [
            `**[${issue.title}](${issue.html_url})**`,
             body ?? 'No description for this issue.'
        ].join('\n')

        let assignees = issue.assignees?.slice(0, 15).map((assignee) => `[${assignee.login}](${assignee.html_url})`).join(',') ?? 'No assignees'
        let details = [
            `**Assignees:** ${assignees}`,
            `**Closed**: ${issue.closed_at != null ? 'Yes' : 'No'}`,
            `**Comments**: ${issue.comments}`,
        ]

        if (issue.closed_by != null) {
            details.push(`**Merged by**: [${issue.closed_by.login}](${issue.closed_by.html_url})`)
        }

        if (issue.milestone != null) {
            details = [...details, `**Milestone**: ${issue.milestone.title}`]
        }

        if (issue.labels.length > 0) {
            // @ts-ignore
            details = [...details, `**Labels**: ${issue.labels.map((label) => label instanceof String ? label : (label.name ?? 'Unknown')).join(', ')}`]
        }

        if (issue.pull_request != null) {
            details = [...details, `**Linked Pull Request**: ${issue.pull_request.html_url}`]
        }

        if (matched.comment != null) {
            const comment = await includeComment(matched.owner, matched.repo, Number.parseInt(matched.comment), issue.title)
            if (comment.description !== '') {
                description = comment.description
            }
        }

        return embed
            .setDescription(description)
            .addFields({
                name: 'Details',
                value: details.join('\n'),
                inline: true
            })
            .setFooter(DiscordUtils.cachedFooter(cached))
            .setTimestamp(new Date())
            .toJSON()
    } catch (ex) {
        // @ts-ignore
        if (ex.status == null || ex.status !== 404) {
            console.error(ex)
            Sentry.captureException(ex)
        } else {
            logger.info('Attempt to request issue %s failed due to the issue not existing.', { owner: matched.owner, repo: matched.repo, issue: matched.issue })
        }
    }

    return null
}