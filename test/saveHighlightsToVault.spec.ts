import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import SaveHighlights from '../src/methods/saveHighlightsToVault';
import { AppleBooksHighlightsImportPluginSettings } from '../src/settings';
import { aggregatedHighlights } from './mocks/aggregatedDetailsData';
import { defaultTemplateMock } from './mocks/renderedTemplate';
import { ICombinedBooksAndHighlights } from '../src/types'

const mockVault = {
	getAbstractFileByPath: vi.fn(),
	// eslint-disable-next-line
	createFolder: vi.fn().mockImplementation(async (folderName: string) => {
		return;
	}),
	// eslint-disable-next-line
	create: vi.fn().mockImplementation(async (filePath: string, data: string) => {
		return;
	}),
	// eslint-disable-next-line
	delete: vi.fn().mockImplementation(async (folderPath: string, force: boolean) => {
		return;
	}),
	adapter: {
		list: vi.fn(),
		// eslint-disable-next-line
		copy: vi.fn().mockImplementation(async (source: string, destination: string) => {
			return;
		}),
	}
};

beforeEach(() => {
	Date.now = vi.fn().mockImplementation(() => 1704060001);
});

afterEach(() => {
	vi.resetAllMocks();
});

const settings = new AppleBooksHighlightsImportPluginSettings();

describe('Save highlights to vault', () => {
	test('Should save highlights to vault', async () => {
		// eslint-disable-next-line
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
		const spyGetAbstractFileByPath = vi.spyOn(mockVault, 'getAbstractFileByPath').mockReturnValue('ibooks-highlights');

		await saveHighlights.saveHighlightsToVault(aggregatedHighlights as ICombinedBooksAndHighlights[]);

		expect(spyGetAbstractFileByPath).toHaveBeenCalledTimes(1);
		expect(spyGetAbstractFileByPath).toHaveBeenCalledWith('ibooks-highlights');

		expect(mockVault.delete).toHaveBeenCalledTimes(1);
		expect(mockVault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

		expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
		expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

		expect(mockVault.create).toHaveBeenCalledTimes(1);
		expect(mockVault.create).toHaveBeenCalledWith(
			`ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md`,
			defaultTemplateMock
		);
	});

	test('Should skip saving highlights to vault highlights are not found', async () => {
		// eslint-disable-next-line
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, { ...settings, highlightsFolder: '' });
		const spyGetAbstractFileByPath = vi.spyOn(mockVault, 'getAbstractFileByPath').mockReturnValue('');

		await saveHighlights.saveHighlightsToVault(aggregatedHighlights as ICombinedBooksAndHighlights[]);

		expect(spyGetAbstractFileByPath).toHaveBeenCalledTimes(1);
		expect(spyGetAbstractFileByPath).toHaveBeenCalledWith('');

		expect(mockVault.delete).toHaveBeenCalledTimes(0);

		expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
		expect(mockVault.createFolder).toHaveBeenCalledWith('');
	});

	test('Should backup highlights if backup option is enabled', async () => {
		// eslint-disable-next-line
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, { ...settings, backup: true });

		vi.spyOn(mockVault, 'getAbstractFileByPath').mockReturnValue('ibooks-highlights');
		// eslint-disable-next-line
		const spyList = vi.spyOn(mockVault.adapter, 'list').mockImplementation(async (folderPath: string) => {
			return {
				files: [
					'ibooks-highlights/Hello-world.md',
					'ibooks-highlights/Goodbye-world.md',
				],
			};
		});

		await saveHighlights.saveHighlightsToVault(aggregatedHighlights as ICombinedBooksAndHighlights[]);

		expect(spyList).toHaveBeenCalledTimes(1);
		expect(spyList).toReturnWith({
			files: [
				'ibooks-highlights/Hello-world.md',
				'ibooks-highlights/Goodbye-world.md',
			],
		});

		expect(mockVault.createFolder).toHaveBeenCalledTimes(2);
		expect(mockVault.createFolder).toHaveBeenNthCalledWith(1, `ibooks-highlights-bk-1704060001`);
		expect(mockVault.createFolder).toHaveBeenNthCalledWith(2, 'ibooks-highlights');

		expect(mockVault.adapter.copy).toHaveBeenNthCalledWith(1, 'ibooks-highlights/Hello-world.md', 'ibooks-highlights-bk-1704060001/Hello-world.md');
		expect(mockVault.adapter.copy).toHaveBeenNthCalledWith(2, 'ibooks-highlights/Goodbye-world.md', 'ibooks-highlights-bk-1704060001/Goodbye-world.md');
	});
});
