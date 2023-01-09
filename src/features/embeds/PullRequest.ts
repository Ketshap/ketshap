import {KetshapEmbed} from "../EmbedGitHub.js";
import {EmbedBuilder, Message, APIEmbed} from "discord.js";
import {GitHubUtils} from "../../utils/github.js";
import {logger} from "../../logger/winston.js";
import {StringUtil} from "../../utils/string.js";
import {DiscordUtils} from "../../utils/discord.js";
import * as Sentry from "@sentry/node";

export const PullRequest: KetshapEmbed = {
    name: 'pull_request',
    regex: /^https:\/\/github\.com\/(?<owner>[a-zA-z-_.]+)\/(?<repo>[a-zA-z-_.]+)\/pull\/(?<pull>\d+)\/?$/,
    on: on
}

async function on(message: Message, match: RegExpMatchArray) {
    const matched = { owner: match.groups!['owner'], repo: match.groups!['repo'], pull: Number.parseInt(match.groups!['pull']) }

    logger.info('Attempting to request pull request %s', matched)
    try {
        const result = await GitHubUtils.requestPull(matched.owner, matched.repo, matched.pull)
        const [cached, pullRequest] = [result.cached, result.data]
        if (pullRequest == null) {
            return null
        }
        const image = GitHubUtils.pullImage(matched.owner, matched.repo, matched.pull)
        const embed = new EmbedBuilder().setImage(image)

        const body = pullRequest.body == null ? null : StringUtil.limit(pullRequest.body, 200)

        let description = [
            `**[${pullRequest.title}](${pullRequest.html_url})**`,
             body ?? 'No description for this pull request.'
        ].join('\n')

        let statistics = [
            `**Comments**: ${pullRequest.comments}`,
            `**Reviews**: ${pullRequest.review_comments}`,
            `**Files Changed**: ${pullRequest.changed_files} (**+${pullRequest.additions}** **-${pullRequest.deletions}**)`,
            `**Commits**: ${pullRequest.commits}`,
        ]

        let assignees = pullRequest.assignees?.slice(0, 15).map((assignee) => `[${assignee.login}](${assignee.html_url})`).join(',') ?? 'No assignees'
        let details = [
            `**Assignees:** ${assignees}`,
            `**Merged**: ${pullRequest.merged ? 'Yes' : 'No'}`
        ]

        if (pullRequest.merged_by != null) {
            details.push(`**Merged by**: [${pullRequest.merged_by.login}](${pullRequest.merged_by.html_url})`)
        }

        if (pullRequest.milestone != null) {
            details = [...details, `**Milestone**: ${pullRequest.milestone.title}`]
        }

        if (pullRequest.labels.length > 0) {
            details = [...details, `**Labels**: ${pullRequest.labels.map((label) => label.name).join(', ')}`]
        }

        return embed
            .setDescription(description)
            .addFields({
                name: 'Statistics',
                value: statistics.join('\n'),
                inline: true
            })
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
            logger.info('Attempt to request pull request %s failed due to the pull request not existing.', { owner: matched.owner, repo: matched.repo, pull: matched.pull })
        }
    }

    return null
}