import { Elysia, t } from 'elysia';
import { jwtPlugin } from '../../plugins/jwt';
import { AppError, UnauthorizedError } from '../../errors';
import { getUser, editUser, removeUser } from '../users/users.service';

export const usersRoutes = new Elysia({ prefix: '/users' })
    .use(jwtPlugin)
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
    .patch('/:id', async ({ params, body, jwt, headers }) => {
        const token = headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedError();

        const payload = await jwt.verify(token);
        if (!payload || payload.userId !== params.id) throw new UnauthorizedError();

        const user = await editUser(params.id, body);
        return { user };
    }, {
        body: t.Object({
            // username: t.Optional(t.String({ minLength:3, maxLength: 20 })),
            avatar: t.Optional(t.String())
        })
    })
    //
    .delete('/:id', async ({ params, jwt, headers }) => {
        const token = headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedError();

        const payload = await jwt.verify(token);
        if (!payload || payload.userId !== params.id) throw new UnauthorizedError();

        await removeUser(params.id);
        return { message: 'Conta removida com sucesso!' };
    })