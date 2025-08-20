import { describe, expect, test, vi } from 'vitest';
import * as db from '../src/db';
import { defaultBooks } from '../src/db/seedData';
import { getBooks } from '../src/methods/getBooks';
import type { IBook } from '../src/types';

describe('getBooks', () => {
  test('Should return an array of books', async () => {
    vi.spyOn(db, 'dbRequest').mockResolvedValue(defaultBooks as IBook[]);

    const books = await getBooks();

    expect(books).toEqual(defaultBooks);
  });
});
