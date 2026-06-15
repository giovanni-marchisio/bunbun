import { AppError } from '../../errors';
import { Elysia, t } from 'elysia';
import { reportComment } from './reports.service';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const reportRoutes = new Elysia({ prefix: '/reports' })
    .use(authMiddleware)
    .onError(({ error, set }) => {
        if (error instanceof AppError){
            set.status = error.status
            return { message: error.message }
        }
    })
    //
    .post('/:commentId', async ({ params, body, user }) => {
        await reportComment({
            commentId: params.commentId,
            reportedBy: user.id,
            reason: body.reason
        })
        return { message: 'Comentário foi denúnciado!' };
    }, {
        body: t.Object({
            reason: t.Optional(t.String({ maxLength: 255 }))
        })
    })