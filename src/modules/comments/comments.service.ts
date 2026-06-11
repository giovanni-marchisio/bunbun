import { NotFoundError } from "elysia";
import { 
    findComments, 
    findCommentById, 
    createComment, 
    softDeleteComment 
} from "./comments.repository";
import { UnauthorizedError } from "../../errors";

export async function listComments(cursor: string | null, limit: number){
    const items = await findComments(cursor, limit);
    const nextCursor = items.length === limit
        ? items[items.length - 1]?.createdAt?.getTime() ?? null
        : null

    return { items, nextCursor };
};

export async function addComment(data: {
    content: string,
    authorId: string
}) {
    return createComment(data);
};

export async function removeComment(id: string, userId: string){
    const comment = await findCommentById(id);
    if (!comment) throw new NotFoundError('Comentário não encontrado!');
    if (comment.authorId !== userId) throw new UnauthorizedError();

    await softDeleteComment(id);
}
