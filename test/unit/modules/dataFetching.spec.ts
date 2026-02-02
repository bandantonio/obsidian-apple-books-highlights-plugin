import { afterAll, afterEach, beforeEach, describe, expect, test } from 'vitest';
import path from 'path';
import { getBooks, getAnnotations } from '../../../src/modules/dataFetching';
import { purchasedBooks, notDeletedAnnotations } from '../../mocks/dataFetch'
import {
  createTestDatabase,
  deleteTestDatabaseFile,
  destroyTestDatabaseTables,
  testDbName,
} from '../../mocks/mockedDatabaseSetup';

describe('dataFetching', () => {
  const dbPath = path.join(process.cwd(), `test/mocks/${testDbName}`);
  
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
  
  describe('getBooks (mocked database)', async () => {
    test('Should throw an error when books library is empty', async () => {
      db.exec('DELETE FROM ZBKLIBRARYASSET;');
      
      await expect(getBooks(dbPath)).rejects.toThrow('No books found. Looks like your Apple Books library is empty.');
    });
    
    test('Should return an array of books', async () => {
      const fetchedBooks = await getBooks(dbPath);
      
      expect(fetchedBooks).toHaveLength(4);
      expect(fetchedBooks).toEqual(purchasedBooks);
    });
  });
  
  describe('getAnnotations', async () => {    
    test('Should throw an error when annotations database is empty', async () => {      
      db.exec('DELETE FROM ZAEANNOTATION;');
      
      await expect(getAnnotations(dbPath)).rejects.toThrow('No highlights found. Make sure you made some highlights in your Apple Books.');
    });
    
    test('Should return an array of annotations', async () => {
      const fetchedAnnotations = await getAnnotations(dbPath);
      
      expect(fetchedAnnotations).toHaveLength(4);
      expect(fetchedAnnotations).toEqual(notDeletedAnnotations);
    });
  });
});