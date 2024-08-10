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
			include: [
				'main.ts',
				'src/**/*.ts'
			],
			exclude: [
				'src/search.ts',
				'src/db/**/*',
			]
		},
		alias: {
			obsidian: path.resolve(__dirname, 'test/mocks/obsidian.ts')
		},
	}
});
