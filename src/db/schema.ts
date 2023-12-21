import { datetime, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
	username: varchar('username', { length: 255 }),
});

export const oauth_account = mysqlTable(
	'oauth_account',
	{
		providerId: varchar('provider_id', { length: 255 }).notNull(),
		providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
		userId: varchar('user_id', { length: 255 })
			.notNull()
			.references(() => user.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
	}),
);

export const session = mysqlTable('session', {
	id: varchar('id', {
		length: 255,
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 255,
	})
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull(),
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
