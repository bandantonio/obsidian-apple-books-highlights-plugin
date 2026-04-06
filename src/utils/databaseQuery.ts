import { spawn } from 'child_process';

export const executeDbQuery = async <T>(dbPath: string, sqlQuery: string): Promise<T> => {
  const dbQueryResult = spawn('sqlite3', [dbPath, sqlQuery, '-json']);

  const chunks: string[] = [];
  const errorChunks: string[] = [];

  await Promise.all([
    (async () => {
      for await (const chunk of dbQueryResult.stdout) {
        chunks.push(chunk);
      }
    })(),

    (async () => {
      for await (const chunk of dbQueryResult.stderr) {
        errorChunks.push(chunk);
      }
    })(),
  ]);

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
