import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import type { IBook, IAnnotation } from '../types';

export const getBooks = async (booksDbPath?: string): Promise<IBook[]> => {
  const BOOKS_DB_PATH: string = path.join(
    os.homedir(),
    'Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite',
  );
  
  const dbQuery = `SELECT
  ZASSETID as bookId,
  ZTITLE as bookTitle,
  ZAUTHOR as bookAuthor,
  ZGENRE as bookGenre,
  ZLANGUAGE as bookLanguage,
  ZLASTOPENDATE as bookLastOpenedDate,
  ZDATEFINISHED as bookFinishedDate,
  ZCOVERURL as bookCoverUrl
  FROM ZBKLIBRARYASSET
  WHERE ZPURCHASEDATE IS NOT NULL`;
  
  try {
    return await dbRequest(booksDbPath || BOOKS_DB_PATH, dbQuery);
  } catch (error) {
    throw new Error('No books found. Looks like your Apple Books library is empty.');
  }
};

export const getAnnotations = async (annotationsDbPath?: string): Promise<IAnnotation[]> => {
  const HIGHLIGHTS_DB_PATH: string = path.join(
    os.homedir(),
    'Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite',
  );
  
  const annotationsQuery = `SELECT
  ZANNOTATIONASSETID as assetId,
  ZFUTUREPROOFING5 as chapter,
  ZANNOTATIONREPRESENTATIVETEXT as contextualText,
  ZANNOTATIONSELECTEDTEXT as highlight,
  ZANNOTATIONNOTE as note,
  ZANNOTATIONLOCATION as highlightLocation,
  ZANNOTATIONSTYLE as highlightStyle,
  ZANNOTATIONCREATIONDATE as highlightCreationDate,
  ZANNOTATIONMODIFICATIONDATE as highlightModificationDate
  FROM ZAEANNOTATION
  WHERE ZANNOTATIONDELETED IS 0
  AND ZANNOTATIONSELECTEDTEXT IS NOT NULL`;
  
  try {
    return await annotationsRequest(annotationsDbPath || HIGHLIGHTS_DB_PATH, annotationsQuery);
  } catch (error) {
    throw new Error('No highlights found. Make sure you made some highlights in your Apple Books.');
  }
};

const dbRequest = async (dbPath: string, sqlQuery: string): Promise<IBook[]> => {
  const dbQueryResult = spawn('sqlite3', [dbPath, sqlQuery, '-json']);
  
  const chunks: string[] = [];
  for await (const chunk of dbQueryResult.stdout) {
    chunks.push(chunk);
  }
  const result = chunks.join('');
  
  try {
    return JSON.parse(result);
  } catch (error) {
    throw new Error('Failed to parse database result');
  }
};

export const annotationsRequest = async (dbPath: string, sqlQuery: string): Promise<IAnnotation[]> => {
  const dbQueryResult = spawn('sqlite3', [dbPath, sqlQuery, '-json']);
  
  const chunks: string[] = [];
  for await (const chunk of dbQueryResult.stdout) {
    chunks.push(chunk);
  }
  const result = chunks.join('');
  
  try {
    return JSON.parse(result);
  } catch (error) {
    throw new Error('Failed to parse database result');
  }
};
