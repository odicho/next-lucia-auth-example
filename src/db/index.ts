import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

export const poolConnection = mysql.createPool({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	ssl: {
		rejectUnauthorized: false,
	},
});

export const db = drizzle(poolConnection);
