import {Module} from "./types/module.js";
import {needs} from "../utils/env.js";
import { createClient } from 'redis'
import {logger} from "../logger/winston.js";

export let redis = createClient()
export const Redis: Module = {
    name: 'redis',
    init: async () => {
        const { REDIS_URL } = needs('REDIS_URL') as { REDIS_URL: string }
        redis = createClient({ url: REDIS_URL })
        await redis.connect()
    }
}

export async function fromCacheOtherwise<Result>(key: string, expiresInSeconds: number | null, otherwise: () => Promise<Result>): Promise<CachedResult<Result>> {
    const cached = await redis.get(key)
    if (cached != null) {
        logger.info(`Redis has managed to pull ${key} from cache.`)
        return { cached: true, data: JSON.parse(cached) }
    }
    const result = await otherwise()
    if (result == null) return { cached: false, data: null }
    if (expiresInSeconds == null) await redis.set(key, JSON.stringify(result)); else await redis.setEx(key, expiresInSeconds, JSON.stringify(result));
    return { cached: false, data: result }
}

export type CachedResult<Result> = {
    cached: boolean,
    data: Result | null
}