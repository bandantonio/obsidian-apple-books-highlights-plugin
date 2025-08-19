import os from 'os';
import path from 'path';
import { beforeEach, describe, expect, test } from 'vitest';

declare module 'vitest' {
  interface TestContext {
    manifest: {
      id: string;
      name: string;
      description: string;
      minAppVersion: string;
      version: string;
      author: string;
      authorUrl: string;
    };
  }
}

import * as packageJson from '../package.json';
import {
  BOOKS_DB_PATH,
  BOOKS_LIBRARY_COLUMNS,
  BOOKS_LIBRARY_NAME,
  HIGHLIGHTS_DB_PATH,
  HIGHLIGHTS_LIBRARY_COLUMNS,
  HIGHLIGHTS_LIBRARY_NAME,
} from '../src/db/constants';

describe('Plugin information', () => {
  beforeEach((context) => {
    context.manifest = require('../manifest.json');
  });

  test('Check that versions in package.json and manifest.json match', ({ manifest }) => {
    expect(packageJson.version).toEqual(manifest.version);
  });

  test('check minimum Obsidian version', ({ manifest }) => {
    expect(manifest.minAppVersion).toEqual('0.15.0');
  });

  test('Check plugin id, name and description', ({ manifest }) => {
    expect(manifest.id).toEqual('apple-books-import-highlights');
    expect(manifest.name).toEqual('Apple Books - Import Highlights');
    expect(manifest.description).toEqual('Import your Apple Books highlights and notes to Obsidian.');
  });

  test('Check author information', ({ manifest }) => {
    expect(packageJson.author).toEqual(manifest.author);
    expect(manifest.authorUrl).toEqual('https://github.com/bandantonio');
  });
});

describe('Plugin constants', () => {
  test('Check database paths', () => {
    expect(BOOKS_DB_PATH).toEqual(
      path.join(os.homedir(), 'Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite'),
    );
    expect(HIGHLIGHTS_DB_PATH).toEqual(
      path.join(os.homedir(), 'Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite'),
    );
  });

  test('Check database table names', () => {
    expect(BOOKS_LIBRARY_NAME).toEqual('ZBKLIBRARYASSET');
    expect(HIGHLIGHTS_LIBRARY_NAME).toEqual('ZAEANNOTATION');
  });

  test('Check database columns', () => {
    expect(BOOKS_LIBRARY_COLUMNS).toEqual(['ZASSETID', 'ZTITLE', 'ZAUTHOR', 'ZGENRE', 'ZLANGUAGE', 'ZLASTOPENDATE', 'ZCOVERURL']);

    expect(HIGHLIGHTS_LIBRARY_COLUMNS).toEqual([
      'ZANNOTATIONASSETID',
      'ZFUTUREPROOFING5',
      'ZANNOTATIONREPRESENTATIVETEXT',
      'ZANNOTATIONSELECTEDTEXT',
      'ZANNOTATIONLOCATION',
      'ZANNOTATIONNOTE',
      'ZANNOTATIONCREATIONDATE',
      'ZANNOTATIONMODIFICATIONDATE',
      'ZANNOTATIONSTYLE',
    ]);
  });
});
