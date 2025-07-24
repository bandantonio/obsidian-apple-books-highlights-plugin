import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import SaveHighlights from '../src/methods/saveHighlightsToVault';
import { AppleBooksHighlightsImportPluginSettings } from '../src/settings';
import defaultTemplate from '../src/template';
import { rawCustomTemplateMock, rawCustomTemplateMockWithWrappedTextBlockContainingNewlines } from './mocks/rawTemplates';
import { aggregatedUnsortedHighlights } from './mocks/aggregatedDetailsData';
import {
	defaultTemplateMockWithAnnotationsSortedByDefault,
	renderedCustomTemplateMockWithDefaultSorting,
	renderedCustomTemplateMockWithWrappedTextBlockContainingNewlines,
} from './mocks/renderedTemplate';
import { ICombinedBooksAndHighlights } from '../src/types'

const mockVault = {
	getFileByPath: vi.fn(),
	getFolderByPath: vi.fn(),
	getAbstractFileByPath: vi.fn(),
	// eslint-disable-next-line
	createFolder: vi.fn().mockImplementation(async (folderName: string) => {
		return;
	}),
	// eslint-disable-next-line
	create: vi.fn().mockImplementation(async (filePath: string, data: string) => {
		return;
	}),
	modify: vi.fn().mockImplementation(async (file: any, data: string) => {
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
	settings.template = defaultTemplate;
});

afterEach(() => {
	vi.resetAllMocks();
});

const settings = new AppleBooksHighlightsImportPluginSettings();

describe('Save all highlights to vault', () => {
	dayjs.extend(utc);
	dayjs.extend(timezone);
	const tzSpy = vi.spyOn(dayjs.tz, 'guess');

	test('Should save highlights to vault using the default template', async () => {
		// eslint-disable-next-line
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
		const spyGetFolderByPath = vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');
		vi.spyOn(mockVault, 'getAbstractFileByPath').mockImplementation(() => undefined);

		await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

		expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
		expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

		expect(mockVault.delete).toHaveBeenCalledTimes(1);
		expect(mockVault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

		expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
		expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

		expect(mockVault.create).toHaveBeenCalledTimes(1);
		expect(mockVault.create).toHaveBeenCalledWith(
			`ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md`,
			defaultTemplateMockWithAnnotationsSortedByDefault
		);
	});

	test('Should rename file if it already exists', async () => {
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
		vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');
		let callCount = 0;
		vi.spyOn(mockVault, 'getAbstractFileByPath').mockImplementation(() => {
			callCount++;
			return callCount === 1 ? {} : undefined;
		});

		await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

		expect(mockVault.create).toHaveBeenCalledWith(
			`ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title (1).md`,
			defaultTemplateMockWithAnnotationsSortedByDefault
		);
	});

	test('Should save highlights to vault using the custom colored template', async () => {
		tzSpy.mockImplementation(() => 'America/New_York');

		settings.template = rawCustomTemplateMock;

		// eslint-disable-next-line
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
		const spyGetFolderByPath = vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');

		await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

		expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
		expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

		expect(mockVault.delete).toHaveBeenCalledTimes(1);
		expect(mockVault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

		expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
		expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

		expect(mockVault.create).toHaveBeenCalledTimes(1);
		expect(mockVault.create).toHaveBeenCalledWith(
			`ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md`,
			renderedCustomTemplateMockWithDefaultSorting
		);
	});

	test('Should save highlights to vault using the custom template with wrapped text block', async () => {
		settings.template = rawCustomTemplateMockWithWrappedTextBlockContainingNewlines;
		// eslint-disable-next-line
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
		const spyGetFolderByPath = vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');

		await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

		expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
		expect(spyGetFolderByPath).toHaveBeenCalledWith('ibooks-highlights');

		expect(mockVault.delete).toHaveBeenCalledTimes(1);
		expect(mockVault.delete).toHaveBeenCalledWith('ibooks-highlights', true);

		expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
		expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

		expect(mockVault.create).toHaveBeenCalledTimes(1);
		expect(mockVault.create).toHaveBeenCalledWith(
			`ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md`,
			renderedCustomTemplateMockWithWrappedTextBlockContainingNewlines
		);
	});

	test('Should skip saving highlights to vault if highlights are not found', async () => {
		// eslint-disable-next-line
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, { ...settings, highlightsFolder: '' });
		const spyGetFolderByPath = vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('');

		await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

		expect(spyGetFolderByPath).toHaveBeenCalledTimes(1);
		expect(spyGetFolderByPath).toHaveBeenCalledWith('');

		expect(mockVault.delete).toHaveBeenCalledTimes(0);

		expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
		expect(mockVault.createFolder).toHaveBeenCalledWith('');
	});

	test('Should backup highlights if backup option is enabled', async () => {
		// eslint-disable-next-line
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, { ...settings, backup: true });

		vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');
		// eslint-disable-next-line
		const spyList = vi.spyOn(mockVault.adapter, 'list').mockImplementation(async (folderPath: string) => {
			return {
				files: [
					'ibooks-highlights/Hello-world.md',
					'ibooks-highlights/Goodbye-world.md',
				],
			};
		});

		await saveHighlights.saveAllBooksHighlightsToVault(aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]);

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

describe('Save single book highlights to vault', () => {
	test('Should save a single book when the book doesn\'t exist and backups are turned off', async () => {
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);

		await saveHighlights.saveSingleBookHighlightsToVault((aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]), true);

		expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
		expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

		expect(mockVault.create).toHaveBeenCalledTimes(1);
		expect(mockVault.create).toHaveBeenCalledWith(
			`ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md`,
			defaultTemplateMockWithAnnotationsSortedByDefault
		);
	});

	test('Should save a single book when the book doesn\'t exist and backups are turned on', async () => {
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, { ...settings, backup: true });

		await saveHighlights.saveSingleBookHighlightsToVault((aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]), true);

		expect(mockVault.createFolder).toHaveBeenCalledTimes(1);
		expect(mockVault.createFolder).toHaveBeenCalledWith('ibooks-highlights');

		expect(mockVault.create).toHaveBeenCalledTimes(1);
		expect(mockVault.create).toHaveBeenCalledWith(
			`ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md`,
			defaultTemplateMockWithAnnotationsSortedByDefault
		);

		expect(mockVault.adapter.copy).toHaveBeenCalledTimes(0);
		expect(mockVault.delete).toHaveBeenCalledTimes(0);
	});

	test('Should modify a single book when it already exists in vault and backups are turned off', async () => {
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, settings);
		vi.spyOn(mockVault, 'getFileByPath').mockReturnValue({
			path: 'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md'
		});

		vi.spyOn(saveHighlights, 'modifyExistingBookFile');

		await saveHighlights.saveSingleBookHighlightsToVault((aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]), false);

		expect(saveHighlights.modifyExistingBookFile).toHaveBeenCalledTimes(1);
		expect(saveHighlights.modifyExistingBookFile).toHaveBeenCalledWith({
			path: 'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md'
		},
			defaultTemplateMockWithAnnotationsSortedByDefault
		);
	});

	test('Should modify a single book when it already exists in vault and backups are turned on', async () => {
		const saveHighlights = new SaveHighlights({ vault: mockVault } as any, { ...settings, backup: true });
		vi.spyOn(mockVault, 'getFolderByPath').mockReturnValue('ibooks-highlights');
		vi.spyOn(mockVault, 'getFileByPath').mockReturnValue({
			path: 'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md'
		});

		await saveHighlights.saveSingleBookHighlightsToVault((aggregatedUnsortedHighlights as ICombinedBooksAndHighlights[]), false);

		expect(mockVault.getFileByPath).toHaveBeenCalledTimes(2);
		expect(mockVault.getFileByPath).toHaveBeenCalledWith('ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md');

		expect(mockVault.adapter.copy).toHaveBeenCalledTimes(1);
		expect(mockVault.adapter.copy).toHaveBeenCalledWith(
			'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title.md',
			'ibooks-highlights/Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title-bk-1704060001.md'
		);
	});
});
