import { describe, expect, test, vi } from 'vitest';
import * as db from '../src/db';
import { defaultAnnotations } from '../src/db/seedData';
import { getAnnotations } from '../src/methods/getAnnotations';
import type { IBookAnnotation } from '../src/types';

describe('getAnnotations', () => {
  test('Should return an array of annotations', async () => {
    vi.spyOn(db, 'annotationsRequest').mockResolvedValue(defaultAnnotations as IBookAnnotation[]);

    const books = await getAnnotations();

    expect(books).toEqual(defaultAnnotations);
  });
});
