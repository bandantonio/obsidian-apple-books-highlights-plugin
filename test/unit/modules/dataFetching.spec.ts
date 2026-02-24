import os from 'os';
import path from 'path';
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import * as dataFetching from '../../../src/modules/dataFetching';
import {
  purchasedBooks,
  notDeletedAnnotations,
  annotationsSortedByCreationDateNewToOld,
  annotationsSortedByLastModifiedDateOldToNew,
  annotationsSortedByLastModifiedDateNewToOld,
  annotationsSortedByLocation,
} from '../../mocks/dataFetch'
import {
  createTestDatabase,
  deleteTestDatabaseFile,
  destroyTestDatabaseTables,
} from '../../mocks/mockedDatabaseSetup';

describe('dataFetching', () => {
  let db: any;
  
  beforeEach(async () => {
    const testDbPath = path.join(process.cwd(), 'test/mocks/mockedDatabase.sqlite');
    
    process.env = {
      TEST_DB_PATH: testDbPath,
      BOOKS_DB_PATH: testDbPath,
      ANNOTATIONS_DB_PATH: testDbPath,
    };
    
    db = await createTestDatabase();
  });
  
  afterEach(() => {
    destroyTestDatabaseTables(db);
    vi.resetAllMocks();
  });
  
  afterAll(() => {
    deleteTestDatabaseFile();
  });  
  
  test('Should have the correct env variables defined in vitest config', () => {
    const testDbPath = path.join(process.cwd(), 'test/mocks/mockedDatabase.sqlite');
    expect(process.env.TEST_DB_PATH).toBe(testDbPath);
    expect(process.env.BOOKS_DB_PATH).toBe(testDbPath);
    expect(process.env.ANNOTATIONS_DB_PATH).toBe(testDbPath);
  });
    
  test('Should use default system paths when env variables are not defined', async () => {
    delete process.env.BOOKS_DB_PATH;
    delete process.env.ANNOTATIONS_DB_PATH;
    
    expect(dataFetching.getBooksDbPath()).toBe(path.join(
      os.homedir(),
      'Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite',
    ));
    
    expect(dataFetching.getAnnotationsDbPath()).toBe(path.join(
      os.homedir(),
      'Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite',
    ));
  }); 
    
  describe('getBooks', async () => {  
    test('Should throw an error when books library is empty', async () => {
      db.exec('DELETE FROM ZBKLIBRARYASSET;');
      
      await expect(dataFetching.getBooks()).rejects.toThrow('No books found. Looks like your Apple Books library is empty.');
    });
    
    test('Should return an array of books', async () => {
      const fetchedBooks = await dataFetching.getBooks();
      
      expect(fetchedBooks).toHaveLength(5);
      expect(fetchedBooks).toEqual(purchasedBooks);
    });
  });
  
  describe('getAnnotations', async () => {
    const defaultSortingCriterion = 'creationDateOldToNew';
    
    test('Should throw an error when annotations database is empty', async () => {      
      db.exec('DELETE FROM ZAEANNOTATION;');
      
      await expect(dataFetching.getAnnotations(defaultSortingCriterion)).rejects.toThrow('No highlights found. Make sure you made some highlights in your Apple Books.');
    });
    
    test('Should return an array of annotations with the default sorting criterion', async () => {
      const fetchedAnnotations = await dataFetching.getAnnotations(defaultSortingCriterion);
      
      expect(fetchedAnnotations).toHaveLength(8);
      expect(fetchedAnnotations).toEqual(notDeletedAnnotations);
    });
    
    test('Should return annotations sorted by creation date from new to old (created last will be first)', async () => {
      const sortingCriterion = 'creationDateNewToOld';
      const fetchedAnnotations = await dataFetching.getAnnotations(sortingCriterion);
      
      expect(fetchedAnnotations).toHaveLength(8);
      expect(fetchedAnnotations).toEqual(annotationsSortedByCreationDateNewToOld);
    });
    
    test('Should return annotations sorted by creation date from new to old (created last will be last)', async () => {
      const sortingCriterion = 'lastModifiedDateOldToNew';
      const fetchedAnnotations = await dataFetching.getAnnotations(sortingCriterion);
      
      expect(fetchedAnnotations).toHaveLength(8);
      expect(fetchedAnnotations).toEqual(annotationsSortedByLastModifiedDateOldToNew);
    });
    
    test('Should return annotations sorted by modification date from old to new (modified last will be first)', async () => {
      const sortingCriterion = 'lastModifiedDateNewToOld';
      const fetchedAnnotations = await dataFetching.getAnnotations(sortingCriterion);
      
      expect(fetchedAnnotations).toHaveLength(8);
      expect(fetchedAnnotations).toEqual(annotationsSortedByLastModifiedDateNewToOld);
    });
    
    test('Should return annotations sorted by their location when sorting criterion is "Book"', async () => {
      const sortingCriterion = 'book';
      const fetchedAnnotations = await dataFetching.getAnnotations(sortingCriterion);
      
      expect(fetchedAnnotations).toHaveLength(8);
      expect(fetchedAnnotations).toEqual(annotationsSortedByLocation);
    });
  });
});