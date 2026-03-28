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
    projects: [
      {
        test: {
          include: ['test/unit/**/*.spec.ts'],
          name: { label: 'unit', color: 'green' },
          alias: {
            obsidian: path.resolve(__dirname, 'test/mocks/obsidian.ts'),
          },
        }
      },
      {
        test: {
          include: ['test/integration/*.spec.ts'],
          name: { label: 'integration', color: 'green' },
          alias: {
            obsidian: path.resolve(__dirname, 'test/mocks/obsidian.ts'),
          },
        }
      },
      {
        test: {
          include: ['test/*.spec.ts'],
          name: { label: 'uncategorized', color: 'green' },
        }
      }
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
        // 'main.ts',
        'src/modals/*.ts',
        'src/settings/*.ts'
      ],
    }
  },
});
