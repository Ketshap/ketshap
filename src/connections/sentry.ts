import {Module} from "./types/module.js";
import {needs} from "../utils/env.js";
import * as Sentry from '@sentry/node';
import {getInfo} from "discord-hybrid-sharding";

export const SentryModule: Module = {
    name: 'sentry',
    init: async () => {
        const { SENTRY_DSN } = needs('SENTRY_DSN') as { SENTRY_DSN: string }
        Sentry.init({
            dsn: SENTRY_DSN,
            beforeSend: (event, _) => {
                // @ts-ignore
                event.extra.cluster = getInfo().CLUSTER
                return event
            }
        })
    }
}