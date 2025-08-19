import { dbRequest } from '../db';
import { BOOKS_DB_PATH, BOOKS_LIBRARY_COLUMNS, BOOKS_LIBRARY_NAME } from '../db/constants';
import type { IBook } from '../types';

export const getBooks = async (): Promise<IBook[]> => {
  const bookDetails = (await dbRequest(
    BOOKS_DB_PATH,
    `SELECT ${BOOKS_LIBRARY_COLUMNS.join(', ')} FROM ${BOOKS_LIBRARY_NAME} WHERE ZPURCHASEDATE IS NOT NULL`,
  )) as IBook[];

  return bookDetails;
};
