import path from 'path';
import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['test/**/*.spec.ts'],
		exclude: [...configDefaults.exclude, ".direnv/**/*"],
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
				'src/db/**/*',
			]
		},
		alias: {
			obsidian: path.resolve(__dirname, 'test/mocks/obsidian.ts')
		},
	}
});
