import { db } from '../src/db/client';
import { hash } from '@node-rs/argon2';
import { users } from '../src/db/schema';


const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) throw new Error('Dados inválidos!\n Uso: bun run admin <usuario> <senha>');

const userExist = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username)
});

if (userExist) {
    console.log('Admin já existe!');
    process.exit(0);
};

const hashedPassword = await hash(password);

await db.insert(users).values({
    username,
    password: hashedPassword,
    role: 'admin',
    active: true
});

console.log('Conta admin criada!');
process.exit(0);