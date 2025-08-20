import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import type { IBook, IBookAnnotation } from '../types';
import { type annotations, bookLibrary } from './schemas';

const sqlite = new Database('./test/mocks/testDatabase.sqlite');
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
