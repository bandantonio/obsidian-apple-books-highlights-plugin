/** biome-ignore-all assist/source/useSortedKeys: <Sorting is not required here> */
import path from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'test/**/*.spec.ts'
    ],
    exclude: [
      ...configDefaults.exclude,
      '.direnv/**/*'
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['lcov'],
      include: [
        'main.ts',
        'src/**/*.ts'
      ],
      exclude: [
        'src/search.ts',
        'src/db/**/*',
        'src/settings.ts'
      ],
    },
    alias: {
      obsidian: path.resolve(__dirname, 'test/mocks/obsidian.ts'),
    },
  },
});
