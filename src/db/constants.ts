import os from 'os';
import path from 'path';

export const BOOKS_DB_PATH = path.join(os.homedir(), 'Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite');
export const HIGHLIGHTS_DB_PATH = path.join(os.homedir(), 'Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite');
export const BOOKS_LIBRARY_NAME = 'ZBKLIBRARYASSET';
export const HIGHLIGHTS_LIBRARY_NAME = 'ZAEANNOTATION';
export const BOOKS_LIBRARY_COLUMNS = [
	'ZASSETID',
	'ZTITLE',
	'ZAUTHOR',
	'ZGENRE',
	'ZLANGUAGE',
	'ZLASTOPENDATE',
	'ZCOVERURL'
];
export const HIGHLIGHTS_LIBRARY_COLUMNS = [
	'ZANNOTATIONASSETID',
	'ZFUTUREPROOFING5',
	'ZANNOTATIONREPRESENTATIVETEXT',
	'ZANNOTATIONSELECTEDTEXT',
	'ZANNOTATIONNOTE',
	'ZANNOTATIONCREATIONDATE',
	'ZANNOTATIONMODIFICATIONDATE',
	'ZANNOTATIONSTYLE'
];
