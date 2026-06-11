import { db } from '../../db/client';
import { refreshTokens, users } from '../../db/schema';
import { eq } from 'drizzle-orm';

export async function createUser(data: {
    username: string,
    password: string,
    avatar?: string
}) {
    const [user] = await db.insert(users).values(data).returning()

    if (!user) {
        throw new Error('Erro ao criar usuário')
    }

    return user;
}

export async function findUserByUsername(username: string) {
    return db.query.users.findFirst({
        where: eq(users.username, username)
    });
};

export async function findUserById(id: string) {
    return db.query.users.findFirst({
        where: eq(users.id, id)
    });
};

export async function createRefreshToken(data: {
    token: string,
    userId: string,
    expiresAt: Date
}) {
    const [refreshToken] = await db.insert(refreshTokens)
        .values(data).returning();
    if (!refreshToken) throw new Error('Erro ao criar refresh token!');
    return refreshToken;
};

export async function findRefreshToken(token: string){
    return db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.token, token)
    });
};

export async function deleteRefreshToken(token: string){
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
};

export async function deleteAllUserRefreshTokens(userId: string){
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
};