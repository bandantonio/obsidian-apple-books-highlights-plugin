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
import type { DiagnosticsCollector } from '../utils/diagnostics';
import { Timer } from '../utils/timing';

export class DataService implements IDataService {
  private diagnosticsCollector?: DiagnosticsCollector;

  constructor(diagnosticsCollector?: DiagnosticsCollector) {
    this.diagnosticsCollector = diagnosticsCollector;
  }

  async getBooks(): Promise<IBook[]> {
    const timer = new Timer('DataService.getBooks', this.diagnosticsCollector);
    timer.start();
    try {
      const bookDetails = (await dbRequest(
        BOOKS_DB_PATH,
        `SELECT ${BOOKS_LIBRARY_COLUMNS.join(', ')} FROM ${BOOKS_LIBRARY_NAME} WHERE ZPURCHASEDATE IS NOT NULL`,
      )) as IBook[];
      timer.end();
      return bookDetails;
    } catch (error) {
      timer.end();
      throw new Error(`Failed to fetch books: ${error}`);
    }
  }

  async getAnnotations(): Promise<IBookAnnotation[]> {
    const timer = new Timer('DataService.getAnnotations', this.diagnosticsCollector);
    timer.start();
    try {
      const annotationDetails = (await annotationsRequest(
        HIGHLIGHTS_DB_PATH,
        `SELECT ${HIGHLIGHTS_LIBRARY_COLUMNS.join(', ')} FROM ${HIGHLIGHTS_LIBRARY_NAME} WHERE ZANNOTATIONDELETED IS 0 AND ZANNOTATIONSELECTEDTEXT IS NOT NULL`,
      )) as IBookAnnotation[];
      timer.end();
      return annotationDetails;
    } catch (error) {
      timer.end();
      throw new Error(`Failed to fetch annotations: ${error}`);
    }
  }
}
