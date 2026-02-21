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
