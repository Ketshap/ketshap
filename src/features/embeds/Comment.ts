import {GitHubUtils} from "../../utils/github.js";
import {StringUtil} from "../../utils/string.js";
import * as Sentry from "@sentry/node";
import {logger} from "../../logger/winston.js";

export const includeComment = async (owner: string, repo: string, comment_number: number, title: string): Promise<CommentEmbed> => {
    try {
        const result = await GitHubUtils.requestIssueComment(owner, repo, comment_number)
        const [_, comment] = [result.cached, result.data]
        if (comment != null) {
            let description = [
                `**[${title}](${comment.html_url})**`,
                `Comment by [${comment.user?.login ?? 'Deleted user'}](${comment.user?.html_url ?? 'https://github.com/ghost'})`,
                ``,
                comment.body == null ? 'No description for this comment.' : StringUtil.limit(comment.body, 360)
            ].join('\n')

            return { description: description }
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