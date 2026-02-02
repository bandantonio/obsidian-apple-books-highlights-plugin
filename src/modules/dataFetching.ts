import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import type { IBook, IAnnotationFromDb } from '../types';

export const getBooks = async (booksDbPath?: string): Promise<IBook[]> => {
  const BOOKS_DB_PATH: string = path.join(
    os.homedir(),
    'Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite',
  );
  
  const dbQuery = `SELECT
  ZASSETID as id,
  ZTITLE as title,
  ZAUTHOR as author,
  ZGENRE as genre,
  ZLANGUAGE as language,
  ZLASTOPENDATE as lastOpenedDate,
  ZDATEFINISHED as finishedDate,
  ZCOVERURL as coverUrl
  FROM ZBKLIBRARYASSET
  WHERE ZPURCHASEDATE IS NOT NULL`;
  
  try {
    return await dbRequest(booksDbPath || BOOKS_DB_PATH, dbQuery);
  } catch (error) {
    throw new Error('No books found. Looks like your Apple Books library is empty.');
  }
};

export const getAnnotations = async (annotationsDbPath?: string): Promise<IAnnotationFromDb[]> => {
  const HIGHLIGHTS_DB_PATH: string = path.join(
    os.homedir(),
    'Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite',
  );
  
  const annotationsQuery = `SELECT
  ZANNOTATIONASSETID as assetId,
  ZFUTUREPROOFING5 as chapter,
  ZANNOTATIONREPRESENTATIVETEXT as contextualText,
  ZANNOTATIONSELECTEDTEXT as highlight,
  ZANNOTATIONLOCATION as highlightLocation,
  ZANNOTATIONNOTE as note,
  ZANNOTATIONCREATIONDATE as highlightCreationDate,
  ZANNOTATIONMODIFICATIONDATE as highlightModificationDate,
  ZANNOTATIONSTYLE as highlightStyle
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

export const annotationsRequest = async (dbPath: string, sqlQuery: string): Promise<IAnnotationFromDb[]> => {
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
