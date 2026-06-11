import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const jwtPlugin = new Elysia()
    .use(jwt({
        name: 'jwt',
        secret: Bun.env.JWT_SECRET!,
        exp: '1h'
    }));