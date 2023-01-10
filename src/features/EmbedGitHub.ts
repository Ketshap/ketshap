import {DiscordFeature} from "./types/DiscordFeature.js";
import {APIEmbed, Events, Message} from "discord.js";
import {Repository} from "./embeds/Repository.js";
import {logger} from "../logger/winston.js";
import {PullRequest} from "./embeds/PullRequest.js";
import {Issues} from "./embeds/Issue.js";
import {Commit} from "./embeds/Commit.js";

export const EmbedGitHub: DiscordFeature = {
    name: 'embed-github',
    init: (client) => client.on(Events.MessageCreate, on)
}

export type KetshapEmbed = {
    name: string,
    regex: RegExp,
    on: (message: Message, match: RegExpMatchArray) => Promise<APIEmbed | null>
}

const URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm

const embeds: KetshapEmbed[] = [Repository, PullRequest, Issues, Commit]

async function on(message: Message) {
    if (message.author.bot) return

    const messageEmbeds: APIEmbed[] = []
    const urls = Array.from(message.content.matchAll(URL_REGEX))

    let matched = 0

    for (const url of urls) {
        const link = new URL(url[0])
        let uri = url[0].replace('?' + link.searchParams.toString(), '')

        for(const embed of embeds) {
            logger.info('Checking if %s matches with module [%s]', uri, embed.name)
            const match = embed.regex.exec(uri)
            if (match != null) {
                matched += 1;
                // IMPORTANT: Maximum of five embeds per message only to prevent spamming.
                if (matched <= 5) {
                    const result = await embed.on(message, match)
                    if (result != null) {
                        messageEmbeds.push(result)
                    }
                }
            }
        }
    }

    if (messageEmbeds.length > 0) {
        message.suppressEmbeds(true).then(() => {})
        message.reply({ content: '', embeds: messageEmbeds }).then(() => {})
    }
}