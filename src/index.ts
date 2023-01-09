import dotenv from 'dotenv';
import {logger} from "./logger/winston.js";
import {needs} from "./utils/env.js";
import {ClusterManager} from "discord-hybrid-sharding";
import {fileURLToPath} from 'url';
import * as path from "path";
dotenv.config()

async function main() {
    const { DISCORD_SHARDS_PER_CLUSTER, DISCORD_TOTAL_SHARDS, DISCORD_TOKEN } =
        needs('DISCORD_SHARDS_PER_CLUSTER', 'DISCORD_TOTAL_SHARDS', 'DISCORD_TOKEN') as
            { DISCORD_SHARDS_PER_CLUSTER: string, DISCORD_TOKEN: string, DISCORD_TOTAL_SHARDS: string }
    logger.info('Preparing to start Ketshap with configuration %s', { TOTAL_SHARDS: DISCORD_TOTAL_SHARDS, SHARDS_PER_CLUSTER: DISCORD_SHARDS_PER_CLUSTER })
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const manager = new ClusterManager(`${__dirname}/cluster.js`, {
        totalShards: Number.parseInt(DISCORD_TOTAL_SHARDS),
        shardsPerClusters: Number.parseInt(DISCORD_SHARDS_PER_CLUSTER),
        mode: 'process',
        token: DISCORD_TOKEN
    })

    manager.on('clusterCreate', cluster => logger.info('Cluster %d has been launched.', cluster.id))
    await manager.spawn({timeout: -1})
}

await main()