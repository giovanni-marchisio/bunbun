import { Elysia } from 'elysia';
import { AppError } from '../../errors';
import { adminMiddleware } from '../../middlewares/admin.middleware';
import {
    listUsers,
    listReports,
    activateUser,
    deactivateUser,
    resolveReport,
    dismissReport
} from './admin.service';

export const adminRoutes = new Elysia({ prefix: '/admin' })
    .use(adminMiddleware)
    .onError(({ error, set }) => {
        if (error instanceof AppError){
            set.status = error.status;
            return { message: error.message }
        };
    })
    //
    .get('/users', async () => {
        return listUsers();
    })
    //
    .patch('/users/:id/activate', async ({ params }) => {
        await activateUser(params.id);
        return { message: `Usuário ativado\nID:${params.id}`};
    })
    .patch('users/:id/deactivate', async ({ params }) => {
        await deactivateUser(params.id);
        return { message: `Usuário desativado\nID:${params.id}`};
    })
    //
    .get('reports', async() => {
        return listReports();
    })
    //
    .patch('reports/:id/resolve', async ({ params }) => {
        await resolveReport(params.id);
        return { message: `Denúncia resolvida!\nID:${params.id}`}
    })
    //
    .patch('reports/:id/dismiss', async ({ params}) => {
        await dismissReport(params.id);
        return { message: `Denúncia descartada!\nID:${params.id}`}
    })