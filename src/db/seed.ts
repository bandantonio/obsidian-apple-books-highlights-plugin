import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { TEST_DATABASE_PATH } from '../../drizzle.config';
import { type annotations, bookLibrary } from './schemas';

const sqlite = new Database(TEST_DATABASE_PATH);
const db = drizzle(sqlite);

export const seedDatabase = async (table: typeof bookLibrary | typeof annotations, seed: any[]) => {
  const tableName = table === bookLibrary ? 'books' : 'annotations';
  console.info(`Seeding ${tableName} database...`);

  try {
    await db.delete(table);

    await db.insert(table).values(seed);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.info(`Seeding ${tableName} successful`);
};

export const removeSeededData = () => {
  console.info('Removing seeded data from database...');

  // try {
  //   await db.delete(bookLibrary);
  //   await db.delete(annotations);
  // } catch (error) {
  //   console.error(error);
  //   process.exit(1);
  // }
};
