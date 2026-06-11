import { NotFoundError } from "elysia";
import { findUserById, updateUser, softDeleteUser } from "./users.repository";

export async function getUser(id: string){
    const user = await findUserById(id);
    if (!user) throw new NotFoundError('Usuário não encontrado!');

    const { password:_, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export async function editUser(id: string, data: {
    // username?: string,
    avatar?: string
}) {
    const user = await findUserById(id);
    if (!user) throw new NotFoundError('Usuário não encontrado!');

    const updated = await updateUser(id, data);
    const { password: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
};

export async function removeUser(id: string){
    const user = await findUserById(id);
    if (!user) throw new NotFoundError('Usuario não encontrado!');

    await softDeleteUser(id);
};