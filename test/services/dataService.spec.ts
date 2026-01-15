import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as db from '../../src/db';
import { defaultAnnotations, defaultBooks } from '../../src/db/seedData';
import { DataService } from '../../src/services/dataService';
import type { IBook, IBookAnnotation } from '../../src/types';

describe('dataService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBooks', () => {
    const dataService = new DataService();

    test('Should return an array of books', async () => {
      vi.spyOn(db, 'dbRequest').mockResolvedValue(defaultBooks as IBook[]);

      const books = await dataService.getBooks();

      expect(books).toEqual(defaultBooks);
    });
  });

  describe('getAnnotations', () => {
    const dataService = new DataService();
    test('Should return an array of annotations', async () => {
      vi.spyOn(db, 'annotationsRequest').mockResolvedValue(defaultAnnotations as IBookAnnotation[]);

      const annotations = await dataService.getAnnotations();

      expect(annotations).toEqual(defaultAnnotations);
    });
  });
});
