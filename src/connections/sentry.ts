import {Module} from "./types/module.js";
import {needs} from "../utils/env.js";
import * as Sentry from '@sentry/node';

export const SentryModule: Module = {
    name: 'sentry',
    init: async () => {
        const { SENTRY_DSN } = needs('SENTRY_DSN') as { SENTRY_DSN: string }
        Sentry.init({
            dsn: SENTRY_DSN
        })
    }
}