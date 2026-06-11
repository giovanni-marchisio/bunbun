import { NotFoundError } from 'elysia';
import { db } from '../../db/client';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

export async function findUserById(id: string) {
    return db.query.users.findFirst({
        where: eq(users.id, id)
    });
};

export async function updateUser(id: string, data: {
    // username?: string, Deixar sem opção de editar username por enquanto
    avatar?: string
}) {
    const [user] = await db.update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning()

    if (!user) throw new NotFoundError('Usuário não encontrado!');
    return user
};

export async function softDeleteUser(id: string) {
    await db.update(users)
        .set({ active: false })
        .where(eq(users.id, id))
}