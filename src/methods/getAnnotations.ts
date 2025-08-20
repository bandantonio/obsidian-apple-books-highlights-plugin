import { annotationsRequest } from '../db';
import { HIGHLIGHTS_DB_PATH, HIGHLIGHTS_LIBRARY_COLUMNS, HIGHLIGHTS_LIBRARY_NAME } from '../db/constants';
import type { IBookAnnotation } from '../types';

export const getAnnotations = async (): Promise<IBookAnnotation[]> => {
  const annotationDetails = (await annotationsRequest(
    HIGHLIGHTS_DB_PATH,
    `SELECT ${HIGHLIGHTS_LIBRARY_COLUMNS.join(', ')} FROM ${HIGHLIGHTS_LIBRARY_NAME} WHERE ZANNOTATIONDELETED IS 0 AND ZANNOTATIONSELECTEDTEXT IS NOT NULL`,
  )) as IBookAnnotation[];

  return annotationDetails;
};
