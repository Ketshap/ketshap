import {EmbedFooterOptions} from "discord.js";

export const DiscordUtils = {
    cachedFooter: (cached: boolean): EmbedFooterOptions => {
        return { text: cached ? "The data shown may be outdated due to caching" : "The data shown was recently requested just now" }
    }
}