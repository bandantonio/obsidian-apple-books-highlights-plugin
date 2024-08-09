import { App, TFile, Vault } from 'obsidian';
import path from 'path';
import { ICombinedBooksAndHighlights } from '../types';
import { AppleBooksHighlightsImportPluginSettings } from '../settings';
import { renderHighlightsTemplate } from './renderHighlightsTemplate';
import { sortHighlights } from 'src/methods/sortHighlights';
import BackupHighlights from 'src/utils/backupHighlights';

export default class SaveHighlights {
	private app: App;
	private vault: Vault;
	private settings: AppleBooksHighlightsImportPluginSettings;

	constructor(app: App, settings: AppleBooksHighlightsImportPluginSettings) {
		this.app = app;
		this.vault = this.app.vault;
		this.settings = settings;
	}

	async saveAllBooksHighlightsToVault(highlights: ICombinedBooksAndHighlights[]): Promise<void> {
		const highlightsFolderPath = this.vault.getFolderByPath(
			this.settings.highlightsFolder
		);

		const isBackupEnabled = this.settings.backup;

		if (highlightsFolderPath) {
			if (isBackupEnabled) {
				const backupMethods = new BackupHighlights(this.vault, this.settings);
				await backupMethods.backupAllHighlights();
			} else {
				await this.vault.delete(highlightsFolderPath, true);
				await this.vault.createFolder(this.settings.highlightsFolder);
			}
		} else {
			await this.vault.createFolder(this.settings.highlightsFolder);
		}

		for (const combinedHighlight of highlights) {
			// Order highlights according to the value in settings
			const sortedHighlights = sortHighlights(combinedHighlight, this.settings.highlightsSortingCriterion);

			// Save highlights to vault
			const renderedTemplate = await renderHighlightsTemplate(sortedHighlights, this.settings.template);
			const filePath = path.join(this.settings.highlightsFolder, `${combinedHighlight.bookTitle}.md`);

			await this.createNewBookFile(filePath, renderedTemplate);
		}
	}

	async saveSingleBookHighlightsToVault(highlights: ICombinedBooksAndHighlights[], shouldCreateFile: boolean): Promise<void> {
		const highlightsFolderPath = this.vault.getFolderByPath(
			this.settings.highlightsFolder
		);

		if (!highlightsFolderPath) {
			await this.vault.createFolder(this.settings.highlightsFolder);
		}

		for (const combinedHighlight of highlights) {
			// Order highlights according to the value in settings
			const sortedHighlights = sortHighlights(combinedHighlight, this.settings.highlightsSortingCriterion);

			// Save highlights to vault
			const renderedTemplate = await renderHighlightsTemplate(sortedHighlights, this.settings.template);
			const filePath = path.join(this.settings.highlightsFolder, `${combinedHighlight.bookTitle}.md`);

			if (shouldCreateFile) {
				await this.createNewBookFile(filePath, renderedTemplate);
			} else {
				const isBackupEnabled = this.settings.backup;
				const backupMethods = new BackupHighlights(this.vault, this.settings);

				const vaultFile = this.vault.getFileByPath(filePath) as TFile;

				if (isBackupEnabled) {
					backupMethods.backupSingleBookHighlights(combinedHighlight.bookTitle);
				}

				await this.modifyExistingBookFile(vaultFile, renderedTemplate);
			}
		}
	}

	async modifyExistingBookFile(file: TFile, data: string): Promise<void> {
		await this.vault.modify(
			file,
			data
		);
	}

	async createNewBookFile(filePath: string, data: string): Promise<void> {
		await this.vault.create(
			filePath,
			data
		);
	}
}
