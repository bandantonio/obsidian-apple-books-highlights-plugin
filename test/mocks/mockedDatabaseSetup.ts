import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import type { IAnnotationFromDb, IBook } from '../../src/types';
import { books, annotationsFromDb } from './dataFetch';

export const testDbName = 'mockedDatabase.sqlite';
const dbPath = path.join(__dirname, testDbName);

export const createTestDatabase = async () => {
  const db = new Database(dbPath);
  
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
    VALUES (@id, @title, @author, @genre, @language, @lastOpenedDate, @finishedDate, @coverUrl, @ZPURCHASEDATE);
  `);
  
  const insertAnnotation = db.prepare(`
    INSERT INTO ZAEANNOTATION (ZANNOTATIONASSETID, ZFUTUREPROOFING5, ZANNOTATIONREPRESENTATIVETEXT, ZANNOTATIONSELECTEDTEXT,
      ZANNOTATIONLOCATION, ZANNOTATIONNOTE, ZANNOTATIONCREATIONDATE, ZANNOTATIONMODIFICATIONDATE, ZANNOTATIONSTYLE, ZANNOTATIONDELETED)
    VALUES (@assetId, @chapter, @contextualText, @highlight, @highlightLocation, @note,
      @highlightCreationDate, @highlightModificationDate, @highlightStyle, @ZANNOTATIONDELETED);
  `);
  
  const insertBooksTransaction = db.transaction((booksData: IBook[]) => {
    
    for (const book of booksData) {
      if (book.title !== 'Non-Purchased Book') {
        insertBook.run({
          id: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          language: book.language,
          lastOpenedDate: book.lastOpenedDate,
          finishedDate: book.finishedDate,
          coverUrl: book.coverUrl,
          ZPURCHASEDATE: book.lastOpenedDate,
        });
      } else {
        insertBook.run({
          id: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          language: book.language,
          lastOpenedDate: book.lastOpenedDate,
          finishedDate: book.finishedDate,
          coverUrl: book.coverUrl,
          ZPURCHASEDATE: null,
        });
      }
    }
  });
  
  const insertAnnotationsTransaction = db.transaction((annotationsData: IAnnotationFromDb[]) => {
    for (const ann of annotationsData) {
      insertAnnotation.run({
        assetId: ann.assetId,
        chapter: ann.chapter,
        contextualText: ann.contextualText,
        highlight: ann.highlight,
        highlightLocation: ann.highlightLocation,
        note: ann.note,
        highlightCreationDate: ann.highlightCreationDate,
        highlightModificationDate: ann.highlightModificationDate,
        highlightStyle: ann.highlightStyle,
        ZANNOTATIONDELETED: ann.ZANNOTATIONDELETED
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
  fs.unlinkSync(dbPath);
};