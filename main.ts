import * as child_process from 'child_process';
import * as Handlebars from 'handlebars';
import { normalizePath, Notice, Plugin } from 'obsidian';
import * as path from 'path';
import { promisify } from 'util';
import { DEFAULT_SETTINGS, IBookHighlightsSettingTab } from './src/settings';
import {
	CombinedHighlight,
	IBook,
	IBookAnnotation,
	IBookHighlightsPluginSettings
} from './src/types';

export default class IBookHighlightsPlugin extends Plugin {
	settings: IBookHighlightsPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addRibbonIcon('book-open', this.manifest.name, async () => {
			await this.importHighlights().then(() => {
				new Notice('Apple Books highlights imported successfully');
			}).catch((error) => {
				new Notice('Error while importing Apple Books highlights. Check console for details');
				console.error(`Error importing Apple Books highlights: ${error}`);
			});
		});

		this.addSettingTab(new IBookHighlightsSettingTab(this.app, this));

		this.addCommand({
			id: 'import-all-highlights',
			name: 'Import all highlights',
			callback: async () => {
				await this.importHighlights();
			},
		});
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async getBooks(): Promise<IBook[]> {
		const IBOOK_LIBRARY = '~/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite';
		const booksSql = `
		SELECT ZASSETID, ZTITLE, ZAUTHOR, ZGENRE
		FROM ZBKLIBRARYASSET
		WHERE ZPURCHASEDATE IS NOT NULL`;

		const command = `echo "${booksSql}" | sqlite3 ${IBOOK_LIBRARY} -json`;
		const exec = promisify(child_process.exec);
		const { stdout, stderr } = await exec(command);

		if (stderr) {
			new Notice(stderr);
			return [];
		}

		return JSON.parse(stdout);
	}

	async getAnnotations(): Promise<IBookAnnotation[]> {
		const IBOOK_ANNOTATION_DB = '~/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite';
		const annotationsSql = `
		SELECT ZANNOTATIONASSETID, ZFUTUREPROOFING5, ZANNOTATIONREPRESENTATIVETEXT, ZANNOTATIONSELECTEDTEXT, ZANNOTATIONNOTE
		FROM ZAEANNOTATION
		WHERE ZANNOTATIONSELECTEDTEXT IS NOT NULL
		AND ZANNOTATIONDELETED IS 0`;

		const command = `echo "${annotationsSql}" | sqlite3 ${IBOOK_ANNOTATION_DB} -json`;
		const exec = promisify(child_process.exec);
		const { stdout, stderr } = await exec(command);

		if (stderr) {
			new Notice(stderr);
			return [];
		}

		return JSON.parse(stdout);
	}
	async importHighlights(): Promise<void> {
		const books = await this.getBooks();
		const annotations = await this.getAnnotations();

		const resultingHighlights: CombinedHighlight[] = books.reduce((highlights: CombinedHighlight[], book: IBook) => {
			const bookRelatedAnnotations: IBookAnnotation[] = annotations.filter(annotation => annotation.ZANNOTATIONASSETID === book.ZASSETID);

			if (bookRelatedAnnotations.length > 0) {
				highlights.push({
					bookTitle: book.ZTITLE,
					bookId: book.ZASSETID,
					bookAuthor: book.ZAUTHOR,
					annotations: bookRelatedAnnotations.map(annotation => {
						return {
							chapter: annotation.ZFUTUREPROOFING5,
							contextualText: annotation.ZANNOTATIONREPRESENTATIVETEXT,
							highlight: annotation.ZANNOTATIONSELECTEDTEXT,
							note: annotation.ZANNOTATIONNOTE,
						}
					})
				})
			}

			return highlights;
		}, []);

		await this.saveHighlightsToVault(resultingHighlights);
	}

	async saveHighlightsToVault(highlights: CombinedHighlight[]) {
		const highlightsFolderPath = this.app.vault.getAbstractFileByPath(this.settings.highlightsFolder);
		const isBackupEnabled = this.settings.backup;

		// Backup highlights folder if backup is enabled
		if (highlightsFolderPath) {
			if (isBackupEnabled) {
				const highlightsFilesToBackup = (await this.app.vault.adapter.list(highlightsFolderPath.path)).files;
				const highlightsBackupFolder = `${this.settings.highlightsFolder}-bk-${Date.now()}`;

				await this.app.vault.createFolder(highlightsBackupFolder);

				highlightsFilesToBackup.forEach(async (file: any) => {
					const fileName = path.basename(file);
					await this.app.vault.adapter.copy(normalizePath(file), normalizePath(path.join(highlightsBackupFolder, fileName)));
				});
			}
			await this.app.vault.delete(highlightsFolderPath, true);
		}

		await this.app.vault.createFolder(this.settings.highlightsFolder);

		highlights.forEach(async (highlight: any) => {
			const bookFileName = highlight.bookTitle.replace(/:/g, ' -');

			const template = Handlebars.compile(this.settings.template);
			const renderedTemplate = template(highlight);

			await this.app.vault.create(
				normalizePath(path.join(this.settings.highlightsFolder, `${bookFileName}.md`)),
				renderedTemplate
			);
		});
	}
}
