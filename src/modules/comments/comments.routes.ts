import { Elysia, t } from 'elysia';
import { AppError } from '../../errors';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { listComments, addComment, removeComment } from './comments.service';

export const commentRoutes = new Elysia({ prefix: '/comments' })
    .use(authMiddleware)
    .onError(({ error, set}) => {
        if (error instanceof AppError){
            set.status = error.status
            return { message: error.message }
        }
    })
    .get('/', async ({ query }) => {
        const limit = Number(query.limit) || 10
        const cursor = query.cursor ?? null

        return listComments(cursor, limit);
    }, {
        query: t.Object({
            limit: t.Optional(t.String()),
            cursor: t.Optional(t.String())
        })
    })
    //
    .post('/', async ({ user, body}) =>{
        return addComment({
            content: body.content,
            authorId: user.id
        })
    }, {
        body: t.Object({
            content: t.String({ minLength: 1, maxLength: 500})
        })
    })
    //
    .delete('/:id', async ({ user, params }) => {
        await removeComment(params.id, user.id);
        return { message: 'Comentário foi removido!'};
    })