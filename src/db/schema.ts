import {
    pgTable,
    uuid,
    text,
    timestamp,
    varchar,
    boolean
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id:         uuid('id').defaultRandom().primaryKey(),
    username:   varchar('username', { length: 20 }).notNull().unique(),
    password:   text('password').notNull(),
    avatar:     varchar('avatar', { length: 255 }),
    createdAt:  timestamp('created_at').defaultNow(),
    active:     boolean('active').default(true).notNull()
});

export const comments = pgTable('comments', {
    id:         uuid().defaultRandom().primaryKey(),
    content:    text('content').notNull(),
    createdAt:  timestamp('created_at').defaultNow(),
    deletedAt:  timestamp('deleted_at'),
    active:     boolean('active').default(true).notNull(),
    authorId:   uuid('author_id').notNull()
                                .references(() => users.id)
});

export const refreshTokens = pgTable('refresh_tokens', {
  id:        uuid('id').defaultRandom().primaryKey(),
  token:     text('token').notNull().unique(),
  userId:    uuid('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});