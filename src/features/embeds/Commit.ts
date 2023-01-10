import {KetshapEmbed} from "../EmbedGitHub.js";
import {EmbedBuilder, Message, APIEmbed} from "discord.js";
import {GitHubUtils} from "../../utils/github.js";
import {logger} from "../../logger/winston.js";
import {StringUtil} from "../../utils/string.js";
import {DiscordUtils} from "../../utils/discord.js";
import * as Sentry from "@sentry/node";
import {includeCommitComment} from "./Comment.js";

export const Commit: KetshapEmbed = {
    name: 'commit',
    regex: /^https:\/\/github\.com\/(?<owner>[a-zA-z-_.0-9]+)\/(?<repo>[a-zA-z-_.0-9]+)\/commit\/(?<commit>[0-9a-f]{5,40})(?:#r(?<comment>\d+))?\/?$/,
    on: on
}

async function on(message: Message, match: RegExpMatchArray) {
    const matched = {
        owner: match.groups!['owner'],
        repo: match.groups!['repo'],
        commit: match.groups!['commit'],
        comment: match.groups!['comment']
    }

    logger.info('Attempting to request commit %s', matched)
    try {
        const result = await GitHubUtils.requestCommit(matched.owner, matched.repo, matched.commit)
        const [isCached, commit] = [result.cached, result.data]
        if (commit == null) {
            return null
        }
        const image = GitHubUtils.commitImage(matched.owner, matched.repo, matched.commit)
        const embed = new EmbedBuilder().setImage(image)

        let author: string = '`unknown`'
        if (commit.author != null) {
            author = `[${commit.author.login}](${commit.author.html_url})`

            if (commit.commit.author != null) {
                author += ` (${commit.commit.author.email})`
            }
        } else if (commit.commit.author != null) {
            author = `${commit.commit.author.name} (${commit.commit.author.email})`
        }

        let descriptionArray = [
            `**[${commit.commit.message.slice(0, 72)}](${commit.html_url})**`,
        ]

        if (commit.commit.message.length > 72) {
            descriptionArray = [...descriptionArray, StringUtil.limit(commit.commit.message.slice(72), 360)]
        }

        if (commit.commit.verification != null && commit.commit.verification.verified) {
            descriptionArray = [...descriptionArray, `*This commit is signed and verified by the author.*`]
        }

        let description = descriptionArray.join('\n')
        let statistics = [
            `**Comments**: ${commit.commit.comment_count}`,
            `**Files Changed**: ${commit.files?.length ?? 0} (**+${commit.stats?.additions ?? '0'}** **-${commit.stats?.deletions ?? '0'}**)`,
        ]
        let details = [
            `**Hash**: [${commit.commit.tree.sha}](${commit.html_url})`,
            `**Author**: ${author}`,
        ]

        embed
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

        if (matched.comment != null) {
            const comment = await includeCommitComment(matched.owner, matched.repo, Number.parseInt(matched.comment), commit.commit.message.slice(0, 72))
            if (comment.description !== '') {
                description = comment.description
            }
        }

        return embed
            .setDescription(description)
            .setFooter(DiscordUtils.cachedFooter(isCached))
            .setTimestamp(new Date())
            .toJSON()
    } catch (ex) {
        // @ts-ignore
        if (ex.status == null || ex.status !== 404) {
            console.error(ex)
            Sentry.captureException(ex)
        } else {
            logger.info('Attempt to request commit %s failed due to the commit not existing.', { owner: matched.owner, repo: matched.repo, commit: matched.commit })
        }
    }

    return null
}