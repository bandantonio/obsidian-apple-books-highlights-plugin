import path from 'path';
import { afterEach, describe, expect, test } from 'vitest';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { bookLibrary, annotations } from '../src/db/schemas';
import { annotationsRequest, dbRequest } from '../src/db/index';
import { BOOKS_LIBRARY_NAME, HIGHLIGHTS_LIBRARY_NAME } from '../src/db/constants';
import { TEST_DATABASE_PATH } from '../drizzle.config';
import { seedDatabase } from '../src/db/seed';
import { defaultBooks, defaultAnnotations } from '../src/db/seedData';

afterEach(async () => {
	const dbPath = path.join(process.cwd(), TEST_DATABASE_PATH);

	const sqlite = new Database(dbPath);
	const db = drizzle(sqlite);

	await db.delete(bookLibrary);
	await db.delete(annotations);
});

describe('Empty database', () => {
	test('Should throw an error when books library is empty', async () => {
		try {
			const dbPath = path.join(process.cwd(), TEST_DATABASE_PATH);

			await dbRequest(dbPath, `SELECT * FROM ${BOOKS_LIBRARY_NAME}`);
		} catch (error) {
			expect(error).toEqual('No books found. Looks like your Apple Books library is empty.');
		}
	});

	test('Should throw an error when no highlights found', async () => {
		try {
			await seedDatabase(bookLibrary, defaultBooks);

			const dbPath = path.join(process.cwd(), TEST_DATABASE_PATH);

			await annotationsRequest(dbPath, `SELECT * FROM ${HIGHLIGHTS_LIBRARY_NAME}`);
		} catch (error) {
			expect(error).toEqual(`No highlights found. Make sure you made some highlights in your Apple Books.`);
		}
	});
});

describe('Database operations', () => {
	test('Should return a list of books when books library is not empty', async () => {
		await seedDatabase(bookLibrary, defaultBooks);

		const dbPath = path.join(process.cwd(), TEST_DATABASE_PATH);
		const books = await dbRequest(dbPath, `SELECT * FROM ${BOOKS_LIBRARY_NAME}`);

		expect(books).toEqual(defaultBooks);
	});

	test('Should return a list of highlights when highlights library is not empty', async () => {
		await seedDatabase(annotations, defaultAnnotations);

		const dbPath = path.join(process.cwd(), TEST_DATABASE_PATH);
		const highlights = await annotationsRequest(dbPath, `SELECT * FROM ${HIGHLIGHTS_LIBRARY_NAME} WHERE ZANNOTATIONDELETED = 0`);

		expect(highlights.length).toEqual(4);
		expect(highlights[0].ZANNOTATIONNOTE).toEqual('Test note for the highlight from the iPhone User Guide');
		expect(highlights[3].ZANNOTATIONREPRESENTATIVETEXT).toEqual('This is a contextual text for the highlight from the Apple Watch User Guide');
	});

	test('Should return a highlight link for each highlight when highlights library is not empty', async () => {
		await seedDatabase(annotations, defaultAnnotations);

		const dbPath = path.join(process.cwd(), TEST_DATABASE_PATH);
		const highlights = await annotationsRequest(dbPath, `SELECT * FROM ${HIGHLIGHTS_LIBRARY_NAME} WHERE ZANNOTATIONDELETED = 0`);

		expect(highlights.length).toEqual(4);
		expect(highlights[0].ZANNOTATIONLOCATION).toEqual('test-highlight-link-from-the-iphone-user-guide');
		expect(highlights[1].ZANNOTATIONLOCATION).toEqual('test-highlight-link-from-the-ipad-user-guide');
		expect(highlights[2].ZANNOTATIONLOCATION).toEqual('test-highlight-link-from-the-mac-user-guide');
		expect(highlights[3].ZANNOTATIONLOCATION).toEqual('test-highlight-link-from-the-apple-watch-user-guide');
	});
});

describe('Database load testing', () => {
	test('Should return 1000 books and  in less than 500ms', async () => {

		const oneThousandBooks = [];
		const threeThousandsAnnotations = [];

		// create 1000 books and 3 annotations for each book
		for (let i = 0; i < 1000; i++) {
			oneThousandBooks.push({
				ZASSETID: `THBFYNJKTGFTTVCGSAE${i}`,
				ZTITLE: `Book ${i}`,
				ZAUTHOR: `John Doe`,
				ZGENRE: `Romance`,
				ZLANGUAGE: `EN`,
				ZLASTOPENDATE: 685151385.91602,
				ZCOVERURL: null
			});

			for (let j = 0; j < 3; j++) {
				threeThousandsAnnotations.push({
					ZANNOTATIONASSETID: `THBFYNJKTGFTTVCGSAE${i}`,
					ZFUTUREPROOFING5: `Introduction ${j}`,
					ZANNOTATIONREPRESENTATIVETEXT: `This is a contextual text for the highlight from the Book ${i}`,
					ZANNOTATIONSELECTEDTEXT: `highlight from the Book ${i}`,
					ZANNOTATIONLOCATION: `test-highlight-link-from-the-book-${i}`,
					ZANNOTATIONNOTE: `Test note for the highlight from the Book ${i}`,
					ZANNOTATIONCREATIONDATE: 685151385.91602,
					ZANNOTATIONMODIFICATIONDATE: 685151385.91602,
					ZANNOTATIONSTYLE: 3,
					ZANNOTATIONDELETED: 0
				});
			}
		}

		const dbPath = path.join(process.cwd(), TEST_DATABASE_PATH);
		await seedDatabase(bookLibrary, oneThousandBooks);
		await seedDatabase(annotations, threeThousandsAnnotations);

		const startTime = Date.now();
		const dbBooks = await dbRequest(dbPath, `SELECT * FROM ${BOOKS_LIBRARY_NAME}`);
		const dbAnnotations = await annotationsRequest(dbPath, `SELECT * FROM ${HIGHLIGHTS_LIBRARY_NAME} WHERE ZANNOTATIONDELETED = 0`);
		const endTime = Date.now();

		expect(dbBooks.length).toEqual(1000);
		expect(dbAnnotations.length).toEqual(3000);

		const dbAnnotationLocations = dbAnnotations.filter(({ZANNOTATIONLOCATION}) => ZANNOTATIONLOCATION !== null && ZANNOTATIONLOCATION !== undefined);
		expect(dbAnnotationLocations.length).toEqual(3000);

		expect(endTime - startTime).toBeLessThan(500);
	});
});
