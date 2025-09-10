import os from 'os';
import path from 'path';

export const BOOKS_DB_PATH: string = path.join(
  os.homedir(),
  'Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite',
);
export const HIGHLIGHTS_DB_PATH: string = path.join(
  os.homedir(),
  'Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite',
);
export const BOOKS_LIBRARY_NAME = 'ZBKLIBRARYASSET';
export const HIGHLIGHTS_LIBRARY_NAME = 'ZAEANNOTATION';

// biome-ignore format: columns are easier to read and modify in this format
export const BOOKS_LIBRARY_COLUMNS = [
  'ZASSETID',
  'ZTITLE',
  'ZAUTHOR',
  'ZGENRE',
  'ZLANGUAGE',
  'ZLASTOPENDATE',
  'ZDATEFINISHED',
  'ZCOVERURL',
];
// biome-ignore format: columns are easier to read and modify in this format

export const HIGHLIGHTS_LIBRARY_COLUMNS = [
  'ZANNOTATIONASSETID',
  'ZFUTUREPROOFING5',
  'ZANNOTATIONREPRESENTATIVETEXT',
  'ZANNOTATIONSELECTEDTEXT',
  'ZANNOTATIONLOCATION',
  'ZANNOTATIONNOTE',
  'ZANNOTATIONCREATIONDATE',
  'ZANNOTATIONMODIFICATIONDATE',
  'ZANNOTATIONSTYLE',
];
