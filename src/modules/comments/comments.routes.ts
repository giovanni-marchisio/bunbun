import { Elysia, t } from 'elysia';
import { jwtPlugin } from '../../plugins/jwt';
import { AppError, UnauthorizedError } from '../../errors';
import { listComments, addComment, removeComment } from './comments.service';

export const commentRoutes = new Elysia({ prefix: '/comments' })
    .use(jwtPlugin)
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
    .post('/', async ({ body, jwt, headers }) =>{
        const token = headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedError();

        const payload = await jwt.verify(token);
        if (!payload) throw new UnauthorizedError();

        return addComment({
            content: body.content,
            authorId: payload.userId as string
        })
    }, {
        body: t.Object({
            content: t.String({ minLength: 1, maxLength: 500})
        })
    })
    //
    .delete('/:id', async ({ params, jwt, headers }) => {
        const token = headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedError();

        const payload = await jwt.verify(token);
        if (!payload) throw new UnauthorizedError();

        await removeComment(params.id, payload.userId as string);
        return { message: 'Comentário foi removido!'};
    })