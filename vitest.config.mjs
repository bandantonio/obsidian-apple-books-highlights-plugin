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
            obsidian: new URL('./test/mocks/obsidian.ts', import.meta.url).pathname,
          },
        },
      },
      {
        test: {
          include: ['test/integration/*.spec.ts'],
          name: { label: 'integration', color: 'green' },
          alias: {
            obsidian: new URL('./test/mocks/obsidian.ts', import.meta.url).pathname,
          },
        },
      },
      {
        test: {
          include: ['test/*.spec.ts'],
          name: { label: 'uncategorized', color: 'green' },
        },
      },
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
    },
  },
});
