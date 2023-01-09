import {Module} from "./types/module.js";
import {Octokit} from "@octokit/rest";
import {needs} from "../utils/env.js";
import {logger} from "../logger/winston.js";
import {GitHubUtils} from "../utils/github.js";

export let octokit: Octokit
export const GitHub: Module = {
    name: 'github',
    init: async () => {
        const { GITHUB_TOKEN } = needs('GITHUB_TOKEN') as { GITHUB_TOKEN: string }
        octokit = new Octokit({ auth: GITHUB_TOKEN })
        logger.info('Attempting to test connection with GitHub. %s', { owner: 'Ketshap', repo: 'ketshap' })
        const ketshap = await octokit.rest.repos.get({ owner: 'Ketshap', repo: 'ketshap' })
        const image = await GitHubUtils.requestImage('Ketshap', 'ketshap')
        logger.info('Found the Ketshap repository. %s', { name: ketshap.data.name, description: ketshap.data.description, image: image })
    }
}