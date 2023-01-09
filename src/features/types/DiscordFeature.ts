import {Client} from "discord.js";

export type DiscordFeature = {
    name: string,
    init: (client: Client) => void
}