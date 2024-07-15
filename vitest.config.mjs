import path from 'path';
import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['test/**/*.spec.ts'],
		exclude: [...configDefaults.exclude, '.direnv/**/*', 'test/e2e/'],
		coverage: {
			enabled: true,
			provider: 'istanbul',
			reporter: ['lcov'],
			exclude: [
				'src/template.ts',
				'drizzle.config.ts',
				'esbuild.config.mjs',
				'version-bump.mjs',
				'test/mocks/**/*',
				'test/e2e/',
				'src/db/**/*'
			],
		},
		alias: {
			obsidian: path.resolve(__dirname, 'test/mocks/obsidian.ts')
		},
	}
});
