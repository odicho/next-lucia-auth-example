import type { Config } from 'drizzle-kit';
export default ({
	schema: './src/db/schema.ts',
	out: './drizzle/migrations',
	driver: 'mysql2',
	dbCredentials: {
		host: process.env.DATABASE_HOST ?? '',
		user: process.env.DATABASE_USERNAME,
		database: process.env.DATABASE_NAME ?? '',
		password: process.env.DATABASE_PASSWORD,
	},
} satisfies Config);
