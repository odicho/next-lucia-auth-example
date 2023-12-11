import { mysqlTable, bigint, varchar } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('auth_user', {
	id: varchar('id', {
		length: 15, // change this when using custom user ids
	}).primaryKey(),
	username: varchar('username', { length: 31 }).notNull().unique(),
});

export type User = typeof user.$inferSelect;

export const key = mysqlTable('user_key', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 15,
	})
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar('hashed_password', {
		length: 255,
	}),
});

export const session = mysqlTable('user_session', {
	id: varchar('id', {
		length: 128,
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 15,
	})
		.notNull()
		.references(() => user.id),
	activeExpires: bigint('active_expires', {
		mode: 'number',
	}).notNull(),
	idleExpires: bigint('idle_expires', {
		mode: 'number',
	}).notNull(),
});

export type Session = typeof session.$inferSelect;
