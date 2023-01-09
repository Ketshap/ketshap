import {DiscordFeature} from "./types/DiscordFeature.js";
import {Events} from "discord.js";
import {logger} from "../logger/winston.js";

export const DiscordLogin: DiscordFeature = {
    name: 'discord-login',
    init: client => {
        client.once(Events.ClientReady, client => {
            logger.info('Authenticated into Discord %s', { id: client.user.id, name: client.user.tag })
        })
    }
}