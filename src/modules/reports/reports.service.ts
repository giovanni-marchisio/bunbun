import { ConflictError, NotFoundError } from "../../errors";
import { findCommentById } from "../comments/comments.repository";
import { createReport, findExistingReport } from "./reports.repository";

export async function reportComment(data: {
    commentId: string,
    reportedBy: string,
    reason?: string
}) {
    const comment = await findCommentById(data.commentId);
    if (!comment) throw new NotFoundError('Comentário não encontrado!');

    const reportExist = await findExistingReport(data.commentId, data.reportedBy);
    if (reportExist) throw new ConflictError('Comentário já foi denúnciado!');

    return createReport(data);
}