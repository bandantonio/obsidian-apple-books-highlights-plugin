export const MIGRATIONS_FOLDER_PATH = './migrations';
export const TEST_DATABASE_PATH = './test/mocks/testDatabase.sqlite';

export default {
  dbCredentials: { url: TEST_DATABASE_PATH },
  driver: 'better-sqlite',
  out: MIGRATIONS_FOLDER_PATH,
  schema: './src/db/schemas.ts',
};
