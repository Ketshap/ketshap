import {Module} from "./types/module.js";
import {Client, GatewayIntentBits, Options} from "discord.js";
import {needs} from "../utils/env.js";
import {logger} from "../logger/winston.js";
import {EmbedGitHub} from "../features/EmbedGitHub.js";
import {DiscordLogin} from "../features/DiscordLogin.js";
import {HeyKetchup} from "../features/HeyKetchup.js";
import {DiscordStatus} from "../features/DiscordStatus.js";
import {ClusterClient, getInfo} from "discord-hybrid-sharding";

export const discord: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        UserManager: 0,
        GuildMemberManager: 0,
        GuildBanManager: 0,
        PresenceManager: 0,
    }),
    sweepers: {
        ...Options.DefaultSweeperSettings,
        messages: {
            interval: 120,
            lifetime: 60,
        },
    },
    shards: getInfo().SHARD_LIST,
    shardCount: getInfo().TOTAL_SHARDS
})

const features = [EmbedGitHub, DiscordLogin, HeyKetchup, DiscordStatus]
export const Discord: Module = {
    name: 'discord',
    init: async () => {
        const { DISCORD_TOKEN } = needs('DISCORD_TOKEN') as { DISCORD_TOKEN: string }
        logger.info('Registering the following discord modules [%s]', features.map((feature) => feature.name).join(','))
        for (const feature of features) {
            feature.init(discord)
        }
        logger.info('Attempting to authenticate into Discord.')
        // @ts-ignore
        discord.cluster = new ClusterClient(discord)
        await discord.login(DISCORD_TOKEN)
    }
}