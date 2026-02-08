import { afterAll, afterEach, beforeEach, describe, expect, test } from 'vitest';
import { getBooks, getAnnotations } from '../../../src/modules/dataFetching';
import {
  purchasedBooks,
  notDeletedAnnotations,
  annotationsSortedByCreationDateNewToOld,
  annotationsSortedByLastModifiedDateOldToNew,
  annotationsSortedByLastModifiedDateNewToOld,
  annotationsSortedByLocation
} from '../../mocks/dataFetch'
import {
  createTestDatabase,
  deleteTestDatabaseFile,
  destroyTestDatabaseTables,
} from '../../mocks/mockedDatabaseSetup';

describe('dataFetching', () => {
  let db: any;
  
  beforeEach(async () => {
    db = await createTestDatabase();
  });
  
  afterEach(() => {
    destroyTestDatabaseTables(db);
  });
  
  afterAll(() => {
    deleteTestDatabaseFile();
  });  
  
  describe('getBooks', async () => {
    test('Should throw an error when books library is empty', async () => {
      db.exec('DELETE FROM ZBKLIBRARYASSET;');
      
      await expect(getBooks()).rejects.toThrow('No books found. Looks like your Apple Books library is empty.');
    });
    
    test('Should return an array of books', async () => {
      const fetchedBooks = await getBooks();
      
      expect(fetchedBooks).toHaveLength(5);
      expect(fetchedBooks).toEqual(purchasedBooks);
    });
  });
  
  describe('getAnnotations', async () => {
    const defaultSortingCriterion = 'creationDateOldToNew';
    
    test('Should throw an error when annotations database is empty', async () => {      
      db.exec('DELETE FROM ZAEANNOTATION;');
      
      await expect(getAnnotations(defaultSortingCriterion)).rejects.toThrow('No highlights found. Make sure you made some highlights in your Apple Books.');
    });
    
    test('Should return an array of annotations with the default sorting criterion', async () => {
      const fetchedAnnotations = await getAnnotations(defaultSortingCriterion);
      
      expect(fetchedAnnotations).toHaveLength(8);
      expect(fetchedAnnotations).toEqual(notDeletedAnnotations);
    });
    
    test('Should return annotations sorted by creation date from new to old (created last will be first)', async () => {
      const sortingCriterion = 'creationDateNewToOld';
      const fetchedAnnotations = await getAnnotations(sortingCriterion);
      
      expect(fetchedAnnotations).toHaveLength(8);
      expect(fetchedAnnotations).toEqual(annotationsSortedByCreationDateNewToOld);
    });
    
    test('Should return annotations sorted by creation date from new to old (created last will be last)', async () => {
      const sortingCriterion = 'lastModifiedDateOldToNew';
      const fetchedAnnotations = await getAnnotations(sortingCriterion);
      
      expect(fetchedAnnotations).toHaveLength(8);
      expect(fetchedAnnotations).toEqual(annotationsSortedByLastModifiedDateOldToNew);
    });
    
    test('Should return annotations sorted by modification date from old to new (modified last will be first)', async () => {
      const sortingCriterion = 'lastModifiedDateNewToOld';
      const fetchedAnnotations = await getAnnotations(sortingCriterion);
      
      expect(fetchedAnnotations).toHaveLength(8);
      expect(fetchedAnnotations).toEqual(annotationsSortedByLastModifiedDateNewToOld);
    });
    
    test('Should return annotations sorted by their location when sorting criterion is "Book"', async () => {
      const sortingCriterion = 'book';
      const fetchedAnnotations = await getAnnotations(sortingCriterion);
      
      expect(fetchedAnnotations).toHaveLength(8);
      expect(fetchedAnnotations).toEqual(annotationsSortedByLocation);
    });
  });
});