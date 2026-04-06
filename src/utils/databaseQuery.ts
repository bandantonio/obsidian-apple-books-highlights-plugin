import { spawn } from 'child_process';

export const executeDbQuery = async <T>(dbPath: string, sqlQuery: string): Promise<T> => {
  const dbQueryResult = spawn('sqlite3', [dbPath, sqlQuery, '-json']);

  const chunks: Buffer[] = [];
  const errorChunks: Buffer[] = [];

  // Create exit code promise immediately to attach listeners right away and prevent race conditions
  const exitCodePromise: Promise<number> = new Promise((resolve, reject) => {
    dbQueryResult.on('close', resolve);
    dbQueryResult.on('error', reject);
  });

  // Await all operations in parallel: reading stdout, reading stderr, and waiting for exit
  const [, , exitCode] = await Promise.all([
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

    exitCodePromise,
  ]);

  const result = Buffer.concat(chunks).toString('utf8');
  const errorResult = Buffer.concat(errorChunks).toString('utf8');

  if (exitCode !== 0) {
    throw new Error(`sqlite3 process failed with code ${exitCode}: ${errorResult}`);
  }

  try {
    return JSON.parse(result);
  } catch (error) {
    throw new Error('Failed to parse database result', { cause: error });
  }
};
