import {logger} from "../logger/winston.js";

export const needs = (...fields: string[]): any => {
    const properties: any = {}
    for (const field of fields) {
        const value = process.env[field]
        if (value == null || value.length === 0) {
            logger.error('No value found for %s required property in configuration.', field)
            process.exit()
            return
        }

        properties[field] = value
    }
    return properties
}