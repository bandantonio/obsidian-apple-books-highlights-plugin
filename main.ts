import { Notice, Plugin } from 'obsidian';
import { IBookHighlightsPluginSearchModal } from './src/search';
import { aggregateBookAndHighlightDetails } from './src/methods/aggregateDetails';
import SaveHighlights from './src/methods/saveHighlightsToVault';
import { AppleBooksHighlightsImportPluginSettings, IBookHighlightsSettingTab } from './src/settings';

export default class IBookHighlightsPlugin extends Plugin {
	settings: AppleBooksHighlightsImportPluginSettings;
	saveHighlights: SaveHighlights;

	async onload() {
		const settings = await this.loadSettings();
		this.saveHighlights = new SaveHighlights(this.app, settings);

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
		this.settings = Object.assign(new AppleBooksHighlightsImportPluginSettings(), await this.loadData());

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

		await this.saveHighlights.saveHighlightsToVault(highlights);
	}
}
