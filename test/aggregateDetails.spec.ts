import { describe, expect, test, vi } from 'vitest';
import { aggregateBookAndHighlightDetails } from '../src/methods/aggregateDetails';
import * as db from '../src/db';
import { booksToAggregate, annotationsToAggregate, aggregatedHighlights } from './mocks/aggregatedDetailsData';
import { IBook, IBookAnnotation } from '../src/types';

describe('aggregateBookAndHighlightDetails', () => {
	test('Should return an array of aggregated highlights when a book has highlights', async () => {
		vi.spyOn(db, 'dbRequest').mockResolvedValue(booksToAggregate as IBook[]);
		vi.spyOn(db, 'annotationsRequest').mockResolvedValue(annotationsToAggregate as IBookAnnotation[]);

		const books = await aggregateBookAndHighlightDetails();

		expect(books).toEqual(aggregatedHighlights);
	});

	test('Should return an empty array when a book has no highlights', async () => {
		vi.spyOn(db, 'dbRequest').mockResolvedValue(booksToAggregate as IBook[]);
		vi.spyOn(db, 'annotationsRequest').mockResolvedValue([]);

		const books = await aggregateBookAndHighlightDetails();

		expect(books).toEqual([]);
	});
});
