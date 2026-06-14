import { randomUUIDv7 } from 'bun';
import { hash, verify } from '@node-rs/argon2';
import { ConflictError, UnauthorizedError } from '../../errors';
import { 
    findUserByUsername, 
    createUser,
    createRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    deleteAllUserRefreshTokens
 } from './auth.repository';


export async function register(data: {
    username: string,
    password: string,
    avatar?:  string
}) {
    const 
    {
        username,
        password,
        avatar
    } = data;

    const userExist = await findUserByUsername(username);
    if (userExist) {
        throw new ConflictError('Nome de usuário já esta em uso!');
    };

    const hashedPassword = await hash(password);
    const user = await createUser({
        ...data,
        password: hashedPassword
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;

};

export async function login(data: {
    username: string,
    password: string
}) {
    const 
    {
        username,
        password
    } = data;

    const user = await findUserByUsername(username);
    if (!user) {
        throw new UnauthorizedError('Usuário ou senha inválidos!');
    };

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
        throw new UnauthorizedError('Usuário ou senha inválidos!')
    };

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export async function generateRefreshToken(userId: string){
    const token = randomUUIDv7();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Vou ver um jeito mais bonito de fazer isso aqui

    await createRefreshToken({ token, userId, expiresAt });
    return token;
};

export async function refreshAccessToken(token: string){
    const today = new Date();
    const refreshToken = await findRefreshToken(token);
    if (!refreshToken) throw new UnauthorizedError();

    const userId = refreshToken.userId;

    if (refreshToken.expiresAt < today) {
        await deleteRefreshToken(token);
        throw new UnauthorizedError('Token expirado!');
    };

    return userId;
};

export async function logout(token: string){
    await deleteRefreshToken(token);
};

export async function logoutAll(userId: string){
    await deleteAllUserRefreshTokens(userId);
};