import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { MIGRATIONS_FOLDER_PATH, TEST_DATABASE_PATH } from '../../drizzle.config';

const sqlite = new Database(TEST_DATABASE_PATH);
const db = drizzle(sqlite);

const main = () => {
  console.info('Migration started');

  try {
    migrate(db, {
      migrationsFolder: MIGRATIONS_FOLDER_PATH,
    });

    console.info('Migration successful');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  sqlite.close();
};

main();
