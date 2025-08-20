import { describe, expect, test, vi } from 'vitest';
import * as db from '../src/db';
import { aggregateBookAndHighlightDetails } from '../src/methods/aggregateDetails';
import type { IBook, IBookAnnotation } from '../src/types';
import { aggregatedUnsortedHighlights, annotationsToAggregate, booksToAggregate } from './mocks/aggregatedDetailsData';

describe('aggregateBookAndHighlightDetails', () => {
  test('Should return an array of aggregated unsorted highlights when a book has highlights', async () => {
    vi.spyOn(db, 'dbRequest').mockResolvedValue(booksToAggregate as IBook[]);
    vi.spyOn(db, 'annotationsRequest').mockResolvedValue(annotationsToAggregate as IBookAnnotation[]);

    const books = await aggregateBookAndHighlightDetails();

    expect(books).toEqual(aggregatedUnsortedHighlights);
  });

  test('Should return an empty array when a book has no highlights', async () => {
    vi.spyOn(db, 'dbRequest').mockResolvedValue(booksToAggregate as IBook[]);
    vi.spyOn(db, 'annotationsRequest').mockResolvedValue([]);

    const books = await aggregateBookAndHighlightDetails();

    expect(books).toEqual([]);
  });
});
