import {DiscordFeature} from "./types/DiscordFeature.js";
import {ActivityType, Events} from 'discord.js'

export const DiscordStatus: DiscordFeature = {
    name: 'discord-status',
    init: (client) => {
        client.once(Events.ClientReady, (client) => {
            client.user.setActivity('crushiecakes @ github.com', { type: ActivityType.Watching })
        })
    }
}