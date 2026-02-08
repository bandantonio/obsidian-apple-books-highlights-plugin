import Database from 'better-sqlite3';
import fs from 'fs';
import type { IAnnotation, IBook } from '../../src/types';
import { books, annotationsFromDb } from './dataFetch';

export const createTestDatabase = async () => {
  const db = new Database(process.env.TEST_DB_PATH);
  
  db.exec(`CREATE TABLE IF NOT EXISTS ZBKLIBRARYASSET (
    ZASSETID TEXT,
    ZTITLE TEXT,
    ZAUTHOR TEXT,
    ZGENRE TEXT,
    ZLANGUAGE TEXT,
    ZLASTOPENDATE REAL,
    ZDATEFINISHED REAL,
    ZCOVERURL TEXT,
    ZPURCHASEDATE REAL
  );
    
  CREATE TABLE IF NOT EXISTS ZAEANNOTATION (
    ZANNOTATIONASSETID TEXT,
    ZFUTUREPROOFING5 TEXT,
    ZANNOTATIONREPRESENTATIVETEXT TEXT,
    ZANNOTATIONSELECTEDTEXT TEXT,
    ZANNOTATIONLOCATION TEXT,
    ZANNOTATIONNOTE TEXT,
    ZANNOTATIONCREATIONDATE REAL,
    ZANNOTATIONMODIFICATIONDATE REAL,
    ZANNOTATIONSTYLE INTEGER,
    ZANNOTATIONDELETED INTEGER
  );
`);
  
  const insertBook = db.prepare(`
    INSERT INTO ZBKLIBRARYASSET (ZASSETID, ZTITLE, ZAUTHOR, ZGENRE, ZLANGUAGE, ZLASTOPENDATE, ZDATEFINISHED, ZCOVERURL, ZPURCHASEDATE)
    VALUES (@bookId, @bookTitle, @bookAuthor, @bookGenre, @bookLanguage, @bookLastOpenedDate, @bookFinishedDate, @bookCoverUrl, @ZPURCHASEDATE);
  `);
  
  const insertAnnotation = db.prepare(`
    INSERT INTO ZAEANNOTATION (ZANNOTATIONASSETID, ZFUTUREPROOFING5, ZANNOTATIONREPRESENTATIVETEXT, ZANNOTATIONSELECTEDTEXT,
      ZANNOTATIONLOCATION, ZANNOTATIONNOTE, ZANNOTATIONCREATIONDATE, ZANNOTATIONMODIFICATIONDATE, ZANNOTATIONSTYLE, ZANNOTATIONDELETED)
    VALUES (@assetId, @chapter, @contextualText, @highlight, @highlightLocation, @note,
      @highlightCreationDate, @highlightModificationDate, @highlightStyle, @ZANNOTATIONDELETED);
  `);
  
  const insertBooksTransaction = db.transaction((booksData: IBook[]) => {
    
    for (const book of booksData) {
      const { bookId, bookTitle, bookAuthor, bookGenre, bookLanguage, bookLastOpenedDate, bookFinishedDate, bookCoverUrl } = book;
      
      if (bookTitle !== 'Non-Purchased Book') {
        insertBook.run({
          bookId,
          bookTitle,
          bookAuthor,
          bookGenre,
          bookLanguage,
          bookLastOpenedDate,
          bookFinishedDate,
          bookCoverUrl,
          ZPURCHASEDATE: bookLastOpenedDate,
        });
      } else {
        insertBook.run({
          bookId,
          bookTitle,
          bookAuthor,
          bookGenre,
          bookLanguage,
          bookLastOpenedDate,
          bookFinishedDate,
          bookCoverUrl,
          ZPURCHASEDATE: null,
        });
      }
    }
  });
  
  interface IAnnotationFromDb extends IAnnotation {
    ZANNOTATIONDELETED: number;
  };

  const insertAnnotationsTransaction = db.transaction((annotationsData: IAnnotationFromDb[]) => {
    for (const annotation of annotationsData) {
      const { assetId, chapter, contextualText, highlight, note, highlightLocation, highlightStyle, highlightCreationDate, highlightModificationDate, ZANNOTATIONDELETED } = annotation;
      
      insertAnnotation.run({
        assetId,
        chapter,
        contextualText,
        highlight,
        highlightLocation,
        note,
        highlightCreationDate,
        highlightModificationDate,
        highlightStyle,
        ZANNOTATIONDELETED
      });
    }
  });
  
  insertBooksTransaction(books);
  insertAnnotationsTransaction(annotationsFromDb);
  
  return db;
}

export const destroyTestDatabaseTables = (db: any) => {
  db.exec(`
    DROP TABLE ZBKLIBRARYASSET;
    DROP TABLE ZAEANNOTATION;
  `);
  
  db.close();
}

export const deleteTestDatabaseFile = () => {
  fs.unlinkSync(process.env.TEST_DB_PATH!);
};