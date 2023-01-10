import {EmbedFooterOptions} from "discord.js";

export const DiscordUtils = {
    cachedFooter: (cached: boolean): EmbedFooterOptions => {
        return { text: cached ? "You are seeing a cached version of the data." : "You are seeing the latest version of the data." }
    }
}