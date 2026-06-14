import { Elysia } from 'elysia';
import { jwtPlugin } from '../plugins/jwt';
import { findUserById } from '../modules/users/users.repository';
import { UnauthorizedError } from '../errors';

export const authMiddleware = new Elysia()
    .use(jwtPlugin)
    .derive({ as: 'scoped' }, async ({ headers, jwt }) => {
        const token = headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedError();

        const payload = await jwt.verify(token);
        if (!payload) throw new UnauthorizedError();
        const userId = payload.userId;

        const user = await findUserById(userId as string);
        if (!user) throw new UnauthorizedError();
        if (!user.active) throw new UnauthorizedError('Aguardando aprovação!');

        return { user };
    })