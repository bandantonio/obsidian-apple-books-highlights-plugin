import { normalizePath, Notice, Plugin } from 'obsidian';
import path from 'path';
import { DEFAULT_SETTINGS, IBookHighlightsSettingTab } from './src/settings';
import { IBookHighlightsPluginSearchModal } from './src/search';
import {
	ICombinedBooksAndHighlights,
	IBookHighlightsPluginSettings
} from './src/types';
import { aggregateBookAndHighlightDetails } from './src/methods/aggregateDetails';
import { renderHighlightsTemplate } from './src/methods/renderHighlightsTemplate';

export default class IBookHighlightsPlugin extends Plugin {
	settings: IBookHighlightsPluginSettings;

	async onload() {
		const settings = await this.loadSettings();

		if (settings.importOnStart) {
			await this.aggregateAndSaveHighlights();
		}

		this.addRibbonIcon('book-open', this.manifest.name, async () => {
			await this.aggregateAndSaveHighlights().then(() => {
				new Notice('Apple Books highlights imported successfully');
			}).catch((error) => {
				new Notice(`[${this.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
				console.error(`[${this.manifest.name}]: ${error}`);

			});
		});

		this.addSettingTab(new IBookHighlightsSettingTab(this.app, this));

		this.addCommand({
			id: 'import-all-highlights',
			name: 'Import all',
			callback: async () => {
				try {
					await this.aggregateAndSaveHighlights();
				} catch (error) {
					new Notice(`[${this.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
					console.error(`[${this.manifest.name}]: ${error}`);
				}
			},
		});

		this.addCommand({
			id: 'import-single-highlights',
			name: 'From a specific book...',
			callback: async () => {
				try {
					new IBookHighlightsPluginSearchModal(this.app, this).open();
				} catch (error) {
					new Notice(`[${this.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
					console.error(`[${this.manifest.name}]: ${error}`);
				}
			},
		});
	}

	//eslint-disable-next-line
	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		return this.settings;
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async aggregateAndSaveHighlights(): Promise<void> {
		const highlights = await aggregateBookAndHighlightDetails();

		if (highlights.length === 0) {
			throw ('No highlights found. Make sure you made some highlights in your Apple Books.');
		}

		await this.saveHighlightsToVault(highlights);
	}

	async saveHighlightsToVault(highlights: ICombinedBooksAndHighlights[]) {
		const highlightsFolderPath = this.app.vault.getAbstractFileByPath(this.settings.highlightsFolder);
		const isBackupEnabled = this.settings.backup;

		// Backup highlights folder if backup is enabled
		if (highlightsFolderPath) {
			if (isBackupEnabled) {
				const highlightsFilesToBackup = (await this.app.vault.adapter.list(highlightsFolderPath.path)).files;
				const highlightsBackupFolder = `${this.settings.highlightsFolder}-bk-${Date.now()}`;

				await this.app.vault.createFolder(highlightsBackupFolder);

				highlightsFilesToBackup.forEach(async (file: string) => {
					const fileName = path.basename(file);
					await this.app.vault.adapter.copy(normalizePath(file), normalizePath(path.join(highlightsBackupFolder, fileName)));
				});
			}
			await this.app.vault.delete(highlightsFolderPath, true);
		}

		await this.app.vault.createFolder(this.settings.highlightsFolder);


		highlights.forEach(async (highlight: ICombinedBooksAndHighlights) => {
			const renderedTemplate = await renderHighlightsTemplate(highlight, this.settings.template);

			await this.app.vault.create(
				normalizePath(path.join(this.settings.highlightsFolder, `${highlight.bookTitle}.md`)),
				renderedTemplate
			);
		});
	}
}
