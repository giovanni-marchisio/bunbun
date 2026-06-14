import { Elysia, t } from 'elysia';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { AppError, UnauthorizedError } from '../../errors';
import { getUser, editUser, removeUser } from '../users/users.service';

export const usersRoutes = new Elysia({ prefix: '/users' })
    .onError(({ error, set}) => {
        if (error instanceof AppError){
            set.status = error.status;
            return { message: error.message };
        }
    })
    .get('/:id', async ({ params }) => {
        const user = await getUser(params.id);
        return { user };
    })
    //
    .use(authMiddleware)
    .patch('/:id', async ({ params, body, user }) => {
        if (user.id !== params.id) throw new UnauthorizedError();
        const userUpdate = await editUser(params.id, body);

        return { userUpdate };
    }, {
        body: t.Object({
            // username: t.Optional(t.String({ minLength:3, maxLength: 20 })),
            avatar: t.Optional(t.String())
        })
    })
    //
    .delete('/:id', async ({ params, user }) => {
        if (user.id !== params.id) throw new UnauthorizedError();
        await removeUser(params.id);

        return { message: 'Conta removida com sucesso!' };
    })