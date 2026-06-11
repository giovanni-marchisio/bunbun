import { Elysia, t } from 'elysia';
import { jwtPlugin } from '../../plugins/jwt';
import { 
    register, 
    login,
    logout,
    logoutAll,
    generateRefreshToken,
    refreshAccessToken 
} from './auth.service';
import { AppError, UnauthorizedError } from '../../errors';

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
        return { user, token };
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
    .post('/logout-all', async ({ headers, jwt }) => {
        const token = headers.authorization?.split(' ')[1];
        if(!token) throw new UnauthorizedError();

        const payload = await jwt.verify(token);
        if(!payload) throw new UnauthorizedError();

        const userId = payload.userId;

        await logoutAll(userId as string);
        return { message: 'Todos os dispositivos foram desconectados!' };
    })
    //
    .post('/refresh', async ({ body, jwt }) => {
        const userId = await refreshAccessToken(body.refreshToken);
        const refreshToken = await jwt.sign({ userId });
        return { refreshToken }
    }, {
        body: t.Object({
            refreshToken: t.String()
        })
    })