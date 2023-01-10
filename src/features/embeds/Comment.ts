import {GitHubUtils} from "../../utils/github.js";
import {StringUtil} from "../../utils/string.js";
import * as Sentry from "@sentry/node";
import {logger} from "../../logger/winston.js";

export const includeComment = async (owner: string, repo: string, comment_number: number, title: string): Promise<CommentEmbed> => {
    try {
        const result = await GitHubUtils.requestIssueComment(owner, repo, comment_number)
        const [_, comment] = [result.cached, result.data]
        if (comment != null) {
            return createComment(title, comment.html_url, { login: comment.user?.login, url: comment.user?.html_url }, comment.body)
        }

        return { description: '' }
    } catch (ex) {
        // @ts-ignore
        if (ex.status == null || ex.status !== 404) {
            console.error(ex)
            Sentry.captureException(ex)
        } else {
            logger.info('Attempt to request comment %s failed due to the comment not existing.', { owner: owner, repo: repo, comment: comment_number })
        }

        return { description: '' }
    }
}

const createComment = (title: string, url: string, user: { login: string | undefined, url: string | undefined } , body: string | undefined): CommentEmbed => {
    let description = [
        `**[${title}](${url})**`,
        `Comment by [${user.login ?? 'Deleted user'}](${user.url ?? 'https://github.com/ghost'})`,
        '',
        body == null ? 'No description for this comment.' : StringUtil.limit(body, 360),
    ].join('\n')

    return { description: description }
}

export const includeCommitComment = async (owner: string, repo: string, comment_number: number, title: string): Promise<CommentEmbed> => {
    try {
        const result = await GitHubUtils.requestCommitComment(owner, repo, comment_number)
        const [_, comment] = [result.cached, result.data]
        if (comment != null) {
            return createComment(title, comment.html_url, { login: comment.user?.login, url: comment.user?.html_url }, comment.body)
        }

        return { description: '' }
    } catch (ex) {
        // @ts-ignore
        if (ex.status == null || ex.status !== 404) {
            console.error(ex)
            Sentry.captureException(ex)
        } else {
            logger.info('Attempt to request comment %s failed due to the comment not existing.', { owner: owner, repo: repo, comment: comment_number })
        }

        return { description: '' }
    }
}

export type CommentEmbed = { description: string }