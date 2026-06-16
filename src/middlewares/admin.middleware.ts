import { Elysia } from 'elysia';
import { authMiddleware } from './auth.middleware';
import { UnauthorizedError } from '../errors';

export const adminMiddleware = new Elysia()
    .use(authMiddleware)
    .derive(({ user }) => {
        if (!user) throw new UnauthorizedError();

        if (user.role !== 'admin') throw new UnauthorizedError();
        return {}
    })
    .as('scoped');