import { annotationsRequest, dbRequest } from '../db';
import {
  BOOKS_DB_PATH,
  BOOKS_LIBRARY_COLUMNS,
  BOOKS_LIBRARY_NAME,
  HIGHLIGHTS_DB_PATH,
  HIGHLIGHTS_LIBRARY_COLUMNS,
  HIGHLIGHTS_LIBRARY_NAME,
} from '../db/constants';
import type { IBook, IBookAnnotation, IDataService } from '../types';

export class DataService implements IDataService {
  async getBooks(): Promise<IBook[]> {
    try {
      const bookDetails = (await dbRequest(
        BOOKS_DB_PATH,
        `SELECT ${BOOKS_LIBRARY_COLUMNS.join(', ')} FROM ${BOOKS_LIBRARY_NAME} WHERE ZPURCHASEDATE IS NOT NULL`,
      )) as IBook[];
      return bookDetails;
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error}`);
    }
  }

  async getAnnotations(): Promise<IBookAnnotation[]> {
    try {
      const annotationDetails = (await annotationsRequest(
        HIGHLIGHTS_DB_PATH,
        `SELECT ${HIGHLIGHTS_LIBRARY_COLUMNS.join(', ')} FROM ${HIGHLIGHTS_LIBRARY_NAME} WHERE ZANNOTATIONDELETED IS 0 AND ZANNOTATIONSELECTEDTEXT IS NOT NULL`,
      )) as IBookAnnotation[];
      return annotationDetails;
    } catch (error) {
      throw new Error(`Failed to fetch annotations: ${error}`);
    }
  }
}
