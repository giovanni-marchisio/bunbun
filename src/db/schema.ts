import { relations } from 'drizzle-orm';
import {
    pgTable,
    pgEnum,
    uuid,
    text,
    timestamp,
    varchar,
    boolean
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'admin']);
export const reportStatusEnum = pgEnum('report_status', ['pending', 'resolved', 'dismissed']);

export const users = pgTable('users', {
    id:         uuid('id').defaultRandom().primaryKey(),
    role:       roleEnum('role').default('user').notNull(),
    username:   varchar('username', { length: 20 }).notNull().unique(),
    password:   text('password').notNull(),
    avatar:     varchar('avatar', { length: 255 }),
    createdAt:  timestamp('created_at').defaultNow(),
    active:     boolean('active').default(false).notNull()
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

export const reports = pgTable('reports', {
    id:         uuid('id').defaultRandom().primaryKey(),
    commentId:  uuid('comment_id').notNull().references(() => comments.id),
    reportedBy: uuid('reported_by').notNull().references(() => users.id),
    reason:     text('reason'),
    status:     reportStatusEnum('status').default('pending').notNull(),
    createdAt:  timestamp('created_at').defaultNow()
})

export const refreshTokens = pgTable('refresh_tokens', {
  id:        uuid('id').defaultRandom().primaryKey(),
  token:     text('token').notNull().unique(),
  userId:    uuid('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const userRelations = relations(users, ({ many }) => ({
    comments: many(comments),
    reports: many(reports, { 
        relationName: 'reporter' 
    }),
    refreshTokens: many(refreshTokens)
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
    author: one(users, { 
        fields: [ comments.authorId],
        references: [users.id]
    }),
    reports: many(reports)
}));

export const reportsRelations = relations(reports, ({ one }) => ({
    comment: one(comments, { 
        fields: [reports.commentId],
        references: [comments.id]
    }),
    reporter: one(users, {
        fields: [reports.reportedBy],
        references: [users.id],
        relationName: 'reporter'
    })
}));