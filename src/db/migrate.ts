import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { MIGRATIONS_FOLDER_PATH } from '../../drizzle.config';
import { TEST_DATABASE_PATH } from '../../drizzle.config';

const sqlite = new Database(TEST_DATABASE_PATH);
const db = drizzle(sqlite);

const main = async () => {
	console.log('Migration started');

	try {
		migrate(db, {
			migrationsFolder: MIGRATIONS_FOLDER_PATH
		});

		console.log('Migration successful');
	} catch (error) {
		console.error(error);
		process.exit(1);
	}

	sqlite.close();
};

main();
