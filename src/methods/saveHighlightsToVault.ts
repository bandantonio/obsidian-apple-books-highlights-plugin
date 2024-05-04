import { App, Vault } from 'obsidian';
import path from 'path';
import { ICombinedBooksAndHighlights } from '../types';
import { AppleBooksHighlightsImportPluginSettings } from '../settings';
import { renderHighlightsTemplate } from './renderHighlightsTemplate';

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

		highlights.forEach(async (highlight: ICombinedBooksAndHighlights) => {
			const renderedTemplate = await renderHighlightsTemplate(highlight, this.settings.template);
			const filePath = path.join(this.settings.highlightsFolder, `${highlight.bookTitle}.md`);

			await this.vault.create(
				filePath,
				renderedTemplate
			);
		});
	}
}
