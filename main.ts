import * as child_process from 'child_process';
import * as Handlebars from 'handlebars';
import { normalizePath, Notice, Plugin } from 'obsidian';
import * as path from 'path';
import { promisify } from 'util';
import { DEFAULT_SETTINGS, IBookHighlightsSettingTab } from './src/settings';
import { IBookHighlightsPluginSearchModal } from './src/search';
import {
	CombinedHighlight,
	IBook,
	IBookAnnotation,
	IBookHighlightsPluginSettings
} from './src/types';

export default class IBookHighlightsPlugin extends Plugin {
	settings: IBookHighlightsPluginSettings;

	async onload() {
		let settings = await this.loadSettings();
		
		if (settings.importOnStart) {
			await this.importAndSaveHighlights();
		}
		
		this.addRibbonIcon('book-open', this.manifest.name, async () => {
			await this.importAndSaveHighlights().then(() => {
				new Notice('Apple Books highlights imported successfully');
			}).catch((error) => {
				new Notice('Error while importing Apple Books highlights. Check console for details');
				console.error(`Error importing Apple Books highlights: ${error}`);
			});
		});

		this.addSettingTab(new IBookHighlightsSettingTab(this.app, this));

		this.addCommand({
			id: 'import-all-highlights',
			name: 'Import all',
			callback: async () => {
				await this.importAndSaveHighlights();
			},
		});
		
		this.addCommand({
			id: 'import-single-highlights',
			name: 'From a specific book...',
			callback: () => {
				new IBookHighlightsPluginSearchModal(this.app, this).open();
			},
		});
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		
		return this.settings;
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
	async importHighlights(): Promise<CombinedHighlight[]> {
		const books = await this.getBooks();
		const annotations = await this.getAnnotations();

		const resultingHighlights: CombinedHighlight[] = books.reduce((highlights: CombinedHighlight[], book: IBook) => {
			const bookRelatedAnnotations: IBookAnnotation[] = annotations.filter(annotation => annotation.ZANNOTATIONASSETID === book.ZASSETID);

			if (bookRelatedAnnotations.length > 0) {
				// Obsidian forbids adding certain characters to the title of a note, so they must be replaced with a dash (-)
				// | # ^ [] \ / :
				const normalizedBookTitle = book.ZTITLE.replace(/[|#\^\[\]\\\/:]+/g, ' -');
				
				highlights.push({
					bookTitle: normalizedBookTitle,
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
		
		return resultingHighlights;
	}
	
	async importAndSaveHighlights(): Promise<void> {
		const highlights = await this.importHighlights();
		
		await this.saveHighlightsToVault(highlights);
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

				highlightsFilesToBackup.forEach(async (file: string) => {
					const fileName = path.basename(file);
					await this.app.vault.adapter.copy(normalizePath(file), normalizePath(path.join(highlightsBackupFolder, fileName)));
				});
			}
			await this.app.vault.delete(highlightsFolderPath, true);
		}

		await this.app.vault.createFolder(this.settings.highlightsFolder);

		highlights.forEach(async (highlight: CombinedHighlight) => {			
			const template = Handlebars.compile(this.settings.template);
			const renderedTemplate = template(highlight);

			await this.app.vault.create(
				normalizePath(path.join(this.settings.highlightsFolder, `${highlight.bookTitle}.md`)),
				renderedTemplate
			);
		});
	}
}
