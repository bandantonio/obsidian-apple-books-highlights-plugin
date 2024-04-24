export const MIGRATIONS_FOLDER_PATH = './migrations';
export const TEST_DATABASE_PATH = './test/mocks/testDatabase.sqlite';

export default {
	driver: 'better-sqlite',
	dbCredentials: {
		url: TEST_DATABASE_PATH
	},
	schema: './src/db/schemas.ts',
	out: MIGRATIONS_FOLDER_PATH,
};
