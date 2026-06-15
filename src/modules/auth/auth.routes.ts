import { AppError } from '../../errors';
import { Elysia, t } from 'elysia';
import { jwtPlugin } from '../../plugins/jwt';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { 
    register, 
    login,
    logout,
    logoutAll,
    generateRefreshToken,
    refreshAccessToken 
} from './auth.service';

export const authRoutes = new Elysia({ prefix: '/auth' })
    .use(jwtPlugin)
    .onError(({ error, set }) => {
        if (error instanceof AppError) {
            set.status = error.status;
            return { message: error.message };
        }
    })
    .post('/register', async ({ body }) => {
        const user = await register(body);
        return { user };
    }, {
        body: t.Object({
            username: t.String({ minLength: 3, maxLength: 20 }),
            password: t.String({ minLength: 6 }),
            avatar: t.Optional(t.String())
        })
    })
    //
    .post('/login', async ({ body, jwt }) => {
        const user = await login(body);
        const token = await jwt.sign({ userId: user.id });
        const refreshToken = await generateRefreshToken(user.id);
        return { user, token, refreshToken };
    }, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    //
    .post('/logout', async ({ body }) =>{
        await logout(body.refreshToken);
        return { message: 'Logout realizado com sucesso!' }
    }, {
        body: t.Object({
            refreshToken: t.String()
        })
    })
    //
    .use(authMiddleware)
    .post('/logout-all', async ({ user }) => {
        await logoutAll(user.id);
        return { message: 'Todos os dispositivos foram desconectados!' };
    })
    //
    .post('/refresh', async ({ body, jwt }) => {
        const userId = await refreshAccessToken(body.refreshToken);
        const accessToken = await jwt.sign({ userId });
        return { accessToken }
    }, {
        body: t.Object({
            refreshToken: t.String()
        })
    })