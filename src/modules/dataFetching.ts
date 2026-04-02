import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import type { IBook, IAnnotation, IHighlightsSortingCriterion } from '../types';
import { sortByLocation } from './annotationsProcessing';

export const getBooksDbPath = (): string => {
  return (
    process.env.BOOKS_DB_PATH ||
    path.join(os.homedir(), 'Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite')
  );
};

export const getAnnotationsDbPath = (): string => {
  return (
    process.env.ANNOTATIONS_DB_PATH ||
    path.join(os.homedir(), 'Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite')
  );
};

export const getBooks = async (): Promise<IBook[]> => {
  const BOOKS_DB_PATH = getBooksDbPath();

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

  const books = await dbRequest(BOOKS_DB_PATH, dbQuery);

  if (books.length === 0) {
    throw new Error('No books found. Looks like your Apple Books library is empty.');
  }

  return books;
};

export const getAnnotations = async (sortingCriterion: IHighlightsSortingCriterion): Promise<IAnnotation[]> => {
  const HIGHLIGHTS_DB_PATH = getAnnotationsDbPath();

  const baseQuery = `SELECT
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

  const sortingOptionsMap: Record<IHighlightsSortingCriterion, string> = {
    creationDateOldToNew: 'ORDER BY ZANNOTATIONCREATIONDATE',
    creationDateNewToOld: 'ORDER BY ZANNOTATIONCREATIONDATE DESC',
    lastModifiedDateOldToNew: 'ORDER BY ZANNOTATIONMODIFICATIONDATE',
    lastModifiedDateNewToOld: 'ORDER BY ZANNOTATIONMODIFICATIONDATE DESC',
    book: '',
  };

  const sortingQueryPart = sortingOptionsMap[sortingCriterion];

  const fullQuery = baseQuery + ' ' + sortingQueryPart;

  const retrievedAnnotations = await annotationsRequest(HIGHLIGHTS_DB_PATH, fullQuery);

  if (retrievedAnnotations.length === 0) {
    throw new Error('No highlights found. Make sure you made some highlights in your Apple Books.');
  }

  if (sortingCriterion !== 'book') {
    return retrievedAnnotations;
  } else {
    return sortByLocation(retrievedAnnotations);
  }
};

export const dbRequest = async (dbPath: string, sqlQuery: string): Promise<IBook[]> => {
  const dbQueryResult = spawn('sqlite3', [dbPath, sqlQuery, '-json']);

  const chunks: string[] = [];
  const errorChunks: string[] = [];

  for await (const chunk of dbQueryResult.stdout) {
    chunks.push(chunk);
  }
  for await (const chunk of dbQueryResult.stderr) {
    errorChunks.push(chunk);
  }

  const result = chunks.join('');
  const errorResult = errorChunks.join('');

  const exitCode: number = await new Promise((resolve, reject) => {
    dbQueryResult.on('close', resolve);
    dbQueryResult.on('error', reject);
  });

  if (exitCode !== 0) {
    throw new Error(`sqlite3 process failed with code ${exitCode}: ${errorResult}`);
  }

  try {
    return JSON.parse(result);
  } catch (error) {
    throw new Error('Failed to parse database result', { cause: error });
  }
};

export const annotationsRequest = async (dbPath: string, sqlQuery: string): Promise<IAnnotation[]> => {
  const dbQueryResult = spawn('sqlite3', [dbPath, sqlQuery, '-json']);

  const chunks: string[] = [];
  const errorChunks: string[] = [];

  for await (const chunk of dbQueryResult.stdout) {
    chunks.push(chunk);
  }
  for await (const chunk of dbQueryResult.stderr) {
    errorChunks.push(chunk);
  }

  const result = chunks.join('');
  const errorResult = errorChunks.join('');

  const exitCode: number = await new Promise((resolve, reject) => {
    dbQueryResult.on('close', resolve);
    dbQueryResult.on('error', reject);
  });

  if (exitCode !== 0) {
    throw new Error(`sqlite3 process failed with code ${exitCode}: ${errorResult}`);
  }

  try {
    return JSON.parse(result);
  } catch (error) {
    throw new Error('Failed to parse database result', { cause: error });
  }
};
