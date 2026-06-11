import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { jwtPlugin } from './plugins/jwt';
import { authRoutes } from './modules/auth/auth.routes';
import { usersRoutes } from './modules/users/users.routes';
import { commentRoutes } from './modules/comments/comments.routes';

export const app = new Elysia()
    .use(jwtPlugin)
    .use(cors())
    .get('/health', () => ({
        status: 'ok',
        message: 'bunbun API is running',
        time: new Date().toLocaleTimeString()
    }))
    .use(authRoutes)
    .use(usersRoutes)
    .use(commentRoutes)
    .listen(3000);

console.log(`http://localhost:${app.server?.port}`);