import { App, Vault } from 'obsidian';
import path from 'path';
import { ICombinedBooksAndHighlights } from '../types';
import { AppleBooksHighlightsImportPluginSettings } from '../settings';
import { renderHighlightsTemplate } from './renderHighlightsTemplate';
import { sortHighlights } from 'src/methods/sortHighlights';

export default class SaveHighlights {
	private app: App;
	private vault: Vault;
	private settings: AppleBooksHighlightsImportPluginSettings;

	constructor(app: App, settings: AppleBooksHighlightsImportPluginSettings) {
		this.app = app;
		this.vault = this.app.vault;
		this.settings = settings;
	}

	async saveHighlightsToVault(highlights: ICombinedBooksAndHighlights[]): Promise<void> {
		const highlightsFolderPath = this.vault.getAbstractFileByPath(
			this.settings.highlightsFolder
		);

		const isBackupEnabled = this.settings.backup;

		// // Backup highlights folder if backup is enabled
		if (highlightsFolderPath) {
			if (isBackupEnabled) {
				const highlightsFilesToBackup = (await this.vault.adapter.list(highlightsFolderPath.path)).files;

				const highlightsBackupFolder = `${this.settings.highlightsFolder}-bk-${Date.now()}`;

				await this.vault.createFolder(highlightsBackupFolder);

				highlightsFilesToBackup.forEach(async (file: string) => {
					const fileName = path.basename(file);

					await this.vault.adapter.copy(file, path.join(highlightsBackupFolder, fileName))
				});
			}

			await this.vault.delete(highlightsFolderPath, true);
		}

		await this.vault.createFolder(this.settings.highlightsFolder);

		highlights.forEach(async (combinedHighlight: ICombinedBooksAndHighlights) => {
			// Order highlights according to the value in settings
			const sortedHighlights = sortHighlights(combinedHighlight, this.settings.highlightsSortingCriterion);

			// Save highlights to vault
			const renderedTemplate = await renderHighlightsTemplate(sortedHighlights, this.settings.template);
			const filePath = path.join(this.settings.highlightsFolder, `${combinedHighlight.bookTitle}.md`);

			await this.vault.create(
				filePath,
				renderedTemplate
			);
		});
	}
}
