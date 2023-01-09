import {logger} from "./logger/winston.js";
import {Module} from "./connections/types/module.js";
import {Redis} from "./connections/redis.js";
import {GitHub} from "./connections/octokit.js";
import {Discord} from "./connections/discord.js";
import {SentryModule} from "./connections/sentry.js";

const modules: Module[] = [Redis, GitHub, SentryModule, Discord]
async function main() {
    logger.info('Starting ketshap %s', { github: 'https://github.com/ShindouMihou/ketshap' })
    logger.info('Enabling the following modules [%s]', modules.map((module) => module.name).join(','))
    for (const module of modules) {
        await module.init()
    }
}

await main()