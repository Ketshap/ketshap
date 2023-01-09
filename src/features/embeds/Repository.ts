import {KetshapEmbed} from "../EmbedGitHub.js";
import {EmbedBuilder, Message, APIEmbed} from "discord.js";
import {GitHubUtils} from "../../utils/github.js";
import {logger} from "../../logger/winston.js";
import {DiscordUtils} from "../../utils/discord.js";

export const Repository: KetshapEmbed = {
    name: 'repository',
    regex: /^https:\/\/github\.com\/(?<owner>[a-zA-z-_.]+)\/(?<repo>[a-zA-z-_.]+)\/?$/,
    on: on
}

async function on(message: Message, match: RegExpMatchArray) {
    const repo = { owner: match.groups!['owner'], repo: match.groups!['repo'] }

    logger.info('Attempting to request repository %s', repo)
    try {
        const result = await GitHubUtils.requestRepo(repo.owner, repo.repo)
        const [cached, repository] = [result.cached, result.data]
        if (repository == null) {
            return null
        }
        const image = (await GitHubUtils.requestImage(repo.owner, repo.repo))!
        const embed = new EmbedBuilder().setImage(image)

        let description = [
            `**[${repository.full_name}](${repository.html_url})**`,
            repository.description ?? 'No description for this repository.',
        ].join('\n')

        let statistics = [
            `**Stars**: ${repository.stargazers_count}`,
            `**Forks**: ${repository.forks_count}`,
            `**Open Issues**: ${repository.open_issues_count}`,
            `**Subscribers**: ${repository.subscribers_count}`,
            `**Watchers**: ${repository.watchers_count}`
        ].join('\n')

        let information = [
            `**Author**: [${repository.owner.login}](${repository.owner.html_url})`
        ]
        if (repository.homepage != null) {
            information.push(`**Homepage**: ${repository.homepage}`)
        }

        return embed
            .setDescription(description)
            .addFields({ name: 'Statistics', value: statistics, inline: true })
            .addFields({ name: 'Information', value: information.join('\n'), inline: true })
            .setFooter(DiscordUtils.cachedFooter(cached))
            .setTimestamp(new Date())
            .toJSON()
    } catch (ex) {
        // @ts-ignore
        if (ex.status != null && ex.status !== 404) {
            console.error(ex)
        } else {
            logger.info('Attempt to request repository %s failed due to the repository not existing.', { owner: repo.owner, repo: repo.repo })
        }
    }

    return null
}