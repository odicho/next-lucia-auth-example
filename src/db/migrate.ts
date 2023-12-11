import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	ssl: {
		rejectUnauthorized: false,
	},
});

const db = drizzle(connection);

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: './drizzle/migrations' });
// Don't forget to close the connection, otherwise the script will hang
await connection.end();
