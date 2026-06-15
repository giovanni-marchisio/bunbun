import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { rateLimit } from 'elysia-rate-limit';
import { jwtPlugin } from './plugins/jwt';
import { authRoutes } from './modules/auth/auth.routes';
import { usersRoutes } from './modules/users/users.routes';
import { commentRoutes } from './modules/comments/comments.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import { reportRoutes } from './modules/reports/reports.routes';

export const app = new Elysia()
    .use(jwtPlugin)
    .use(cors({
        origin: ['http://localhost:5173']
    }))
    .use(rateLimit({
        max: 60,
        duration: 60000
    }))
    .get('/health', () => ({
        status: 'ok',
        message: 'bunbun API is running',
        time: new Date().toLocaleTimeString()
    }))
    .use(authRoutes)
    .use(usersRoutes)
    .use(commentRoutes)
    .use(reportRoutes)
    .use(adminRoutes)
    .listen(3000);

console.log(`http://localhost:${app.server?.port}`);