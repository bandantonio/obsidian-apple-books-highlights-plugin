import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import { IBook, IBookAnnotation } from '../types';

export const dbRequest = async (dbName: string, sqlQuery: string): Promise<IBook[]> => {
	const dbPath = path.join(os.homedir(), 'Downloads', dbName);
	
	const dbQueryResult = spawn('sqlite3', [ dbPath, sqlQuery, '-json' ]);
	
	let result = '';
	for await (const chunk of dbQueryResult.stdout) {
		result += chunk;
	}
	
	try {
		return JSON.parse(result);
	} catch (error) {
		throw ('No books found. Looks like your Apple Books library is empty.');
	}
}

export const dbAnnotationsRequest = async (dbName: string, sqlQuery: string): Promise<IBookAnnotation[]> => {
	const dbPath = path.join(os.homedir(), 'Downloads', dbName);
	
	const dbQueryResult = spawn('sqlite3', [ dbPath, sqlQuery, '-json' ]);
	
	let result = '';
	for await (const chunk of dbQueryResult.stdout) {
		result += chunk;
	}
	
	if (result.length === 0) {
		throw ('No highlights found. Make sure you made some highlights in your Apple Books.');
	}

	return JSON.parse(result);
}
