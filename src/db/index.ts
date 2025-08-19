import { spawn } from 'child_process';
import type { IBook, IBookAnnotation } from '../types';

export const dbRequest = async (dbPath: string, sqlQuery: string): Promise<IBook[]> => {
  const dbQueryResult = spawn('sqlite3', [dbPath, sqlQuery, '-json']);

  let result = '';
  for await (const chunk of dbQueryResult.stdout) {
    result += chunk;
  }

  try {
    return JSON.parse(result);
  } catch (_error) {
    throw 'No books found. Looks like your Apple Books library is empty.';
  }
};

export const annotationsRequest = async (dbPath: string, sqlQuery: string): Promise<IBookAnnotation[]> => {
  const dbQueryResult = spawn('sqlite3', [dbPath, sqlQuery, '-json']);

  let result = '';
  for await (const chunk of dbQueryResult.stdout) {
    result += chunk;
  }

  try {
    return JSON.parse(result);
  } catch (_error) {
    throw 'No highlights found. Make sure you made some highlights in your Apple Books.';
  }
};
