import { describe, expect, test, vi } from 'vitest';
import * as db from '../src/db';
import { aggregateBookAndHighlightDetails } from '../src/methods/aggregateDetails';
import type { IBook, IBookAnnotation } from '../src/types';
import {
  aggregatedUnsortedHighlights,
  annotationsToAggregate,
  annotationsToAggregateWithMissingUserNote,
  booksToAggregate,
} from './mocks/aggregatedDetailsData';

describe('aggregateBookAndHighlightDetails', () => {
  test('Should return an array of aggregated unsorted highlights when a book has highlights', async () => {
    vi.spyOn(db, 'dbRequest').mockResolvedValue(booksToAggregate as IBook[]);
    vi.spyOn(db, 'annotationsRequest').mockResolvedValue(annotationsToAggregate as IBookAnnotation[]);

    const books = await aggregateBookAndHighlightDetails();

    expect(books).toEqual(aggregatedUnsortedHighlights);
  });

  test('Should return an array of aggregated unsorted highlights where the fourth highlight has no user note', async () => {
    vi.spyOn(db, 'dbRequest').mockResolvedValue(booksToAggregate as IBook[]);
    vi.spyOn(db, 'annotationsRequest').mockResolvedValue(annotationsToAggregateWithMissingUserNote as IBookAnnotation[]);

    const books = await aggregateBookAndHighlightDetails();

    expect(books[0].annotations[0].chapter).toBe('Aggregated Introduction 4');
    expect(books[0].annotations[0].note).toBeNull();
    expect(books[0].annotations[1].chapter).toBe('Aggregated Introduction 3');
    expect(books[0].annotations[1].note).toBe('Test note for the third aggregated highlight from the Apple iPhone User Guide');
  });

  test('Should return an empty array when a book has no highlights', async () => {
    vi.spyOn(db, 'dbRequest').mockResolvedValue(booksToAggregate as IBook[]);
    vi.spyOn(db, 'annotationsRequest').mockResolvedValue([]);

    const books = await aggregateBookAndHighlightDetails();

    expect(books).toEqual([]);
  });
});
