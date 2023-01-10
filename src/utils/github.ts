import {StringUtil} from "./string.js";
import {CachedResult, fromCacheOtherwise} from "../connections/redis.js";
import {GetResponseDataTypeFromEndpointMethod} from "@octokit/types";
import {octokit} from "../connections/octokit.js";

const FIVE_MINUTES_IN_SECONDS = 5 * 60

export const GitHubUtils = {
    pullImage: (owner: string, repo: string, pull: number): string => `https://opengraph.githubassets.com/${StringUtil.random(8)}/${owner}/${repo}/pull/${pull}`,
    issueImage: (owner: string, repo: string, issue: number): string => `https://opengraph.githubassets.com/${StringUtil.random(8)}/${owner}/${repo}/issues/${issue}`,
    requestImage: async (owner: string, repo: string): Promise<string | null> =>
        (await fromCacheOtherwise(`image:${repo}:${owner}`, 24 * 60 * 60, async () => {
            return (await octokit.graphql(`{ 
                repository(owner: "${owner}", name: "${repo}") { 
                    openGraphImageUrl 
                } 
            }`) as RepositoryImage).repository.openGraphImageUrl
        })).data,
    requestRepo: async (owner: string, repo: string): Promise<CachedResult<Repository | null>> =>
        await fromCacheOtherwise(`repo:${repo}:${owner}`, FIVE_MINUTES_IN_SECONDS, async () => {
            return (await octokit.repos.get({ repo: repo, owner: owner }))?.data
        }),
    requestPull: async (owner: string, repo: string, pull_number: number): Promise<CachedResult<PullRequest | null>> =>
        await fromCacheOtherwise(`pull:${repo}:${owner}:${pull_number}`, FIVE_MINUTES_IN_SECONDS, async () => {
            return (await octokit.pulls.get({ repo: repo, owner: owner, pull_number: pull_number }))?.data
        }),
    requestIssueComment: async (owner: string, repo: string, comment_number: number): Promise<CachedResult<Comment | null>> =>
        await fromCacheOtherwise(`comment:${repo}:${owner}:${comment_number}`, FIVE_MINUTES_IN_SECONDS, async () => {
            return (await octokit.issues.getComment({ repo: repo, owner: owner, comment_id: comment_number }))?.data
        }),
    requestIssue: async (owner: string, repo: string, issue_number: number): Promise<CachedResult<Issue | null>> =>
        await fromCacheOtherwise(`issue:${repo}:${owner}:${issue_number}`, FIVE_MINUTES_IN_SECONDS, async () => {
            return (await octokit.issues.get({ repo: repo, owner: owner, issue_number: issue_number }))?.data
        })
}

export type RepositoryImage = { repository: { openGraphImageUrl: string } }
export type Repository = GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.get>
export type PullRequest = GetResponseDataTypeFromEndpointMethod<typeof octokit.pulls.get>
export type Comment = GetResponseDataTypeFromEndpointMethod<typeof octokit.issues.getComment>
export type Issue = GetResponseDataTypeFromEndpointMethod<typeof octokit.issues.get>