import * as child_process from 'child_process';
import * as Handlebars from 'handlebars';
import { normalizePath, Notice, Plugin } from 'obsidian';
import dayjs from 'dayjs';
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
		const settings = await this.loadSettings();
		
		if (settings.importOnStart) {
			await this.importAndSaveHighlights();
		}
		
		this.addRibbonIcon('book-open', this.manifest.name, async () => {
			await this.importAndSaveHighlights().then(() => {
				new Notice('Apple Books highlights imported successfully');
			}).catch(() => {
				new Notice(`[${this.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
			});
		});

		this.addSettingTab(new IBookHighlightsSettingTab(this.app, this));

		this.addCommand({
			id: 'import-all-highlights',
			name: 'Import all',
			callback: async () => {
				try {
					await this.importAndSaveHighlights();
				} catch (error) {
					new Notice(`[${this.manifest.name}]:\nError importing highlights. Check console for details (⌥ ⌘ I)`, 0);
				}
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

	//eslint-disable-next-line
	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		
		return this.settings;
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async getBooks(): Promise<IBook[]> {
		try {
			const IBOOK_LIBRARY = '~/Library/Containers/com.apple.iBooksX/Data/Documents/BKLibrary/BKLibrary-1-091020131601.sqlite';
			const booksSql = `
			SELECT ZASSETID, ZTITLE, ZAUTHOR, ZGENRE, ZLANGUAGE, ZLASTOPENDATE, ZCOVERURL
			FROM ZBKLIBRARYASSET
			WHERE ZPURCHASEDATE IS NOT NULL`;

			const command = `echo "${booksSql}" | sqlite3 ${IBOOK_LIBRARY} -json`;
			const exec = promisify(child_process.exec);
			// Issue #11 - Temporary set maxBuffer to 100MB
			// TODO: Need a more efficient solution to handle large data
			const { stdout } = await exec(command, { maxBuffer: 100 * 1024 * 1024 });
			
			if (!stdout) {
				throw('No books found. Looks like your Apple Books library is empty.');
			}
			
			return JSON.parse(stdout);
		} catch (error) {			
			console.warn(`[${this.manifest.name}]:`, error);
			return [];
		}
	}

	async getAnnotations(): Promise<IBookAnnotation[]> {
		try {
			const IBOOK_ANNOTATION_DB = '~/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite';
			const annotationsSql = `
			SELECT ZANNOTATIONASSETID, ZFUTUREPROOFING5, ZANNOTATIONREPRESENTATIVETEXT, ZANNOTATIONSELECTEDTEXT, ZANNOTATIONNOTE, ZANNOTATIONCREATIONDATE, ZANNOTATIONMODIFICATIONDATE, ZANNOTATIONSTYLE
			FROM ZAEANNOTATION
			WHERE ZANNOTATIONSELECTEDTEXT IS NOT NULL
			AND ZANNOTATIONDELETED IS 0`;
	
			const command = `echo "${annotationsSql}" | sqlite3 ${IBOOK_ANNOTATION_DB} -json`;
			const exec = promisify(child_process.exec);
			// Issue #11 - Temporary set maxBuffer to 100MB
			// TODO: Need a more efficient solution to handle large data
			const { stdout } = await exec(command, { maxBuffer: 100 * 1024 * 1024 });
			
			if (stdout.length === 0) {
				throw('No highlights found. Make sure you made some highlights in your Apple Books.');
			}
			
			return JSON.parse(stdout);
		} catch (error) {
			console.warn(`[${this.manifest.name}]:`, error);
			return [];
		}

	}
	async importHighlights(): Promise<CombinedHighlight[]> {
		const books = await this.getBooks();
		const annotations = await this.getAnnotations();

		const resultingHighlights: CombinedHighlight[] = books.reduce((highlights: CombinedHighlight[], book: IBook) => {
			const bookRelatedAnnotations: IBookAnnotation[] = annotations.filter(annotation => annotation.ZANNOTATIONASSETID === book.ZASSETID);

			if (bookRelatedAnnotations.length > 0) {
				// Obsidian forbids adding certain characters to the title of a note, so they must be replaced with a dash (-)
				// | # ^ [] \ / :
				//eslint-disable-next-line
				const normalizedBookTitle = book.ZTITLE.replace(/[\|\#\^\[\]\\\/\:]+/g, ' -');
				
				highlights.push({
					bookTitle: normalizedBookTitle,
					bookId: book.ZASSETID,
					bookAuthor: book.ZAUTHOR,
					bookGenre: book.ZGENRE,
					bookLanguage: book.ZLANGUAGE,
					bookLastOpenedDate: book.ZLASTOPENDATE,
					bookCoverUrl: book.ZCOVERURL,
					annotations: bookRelatedAnnotations.map(annotation => {
						return {
							chapter: annotation.ZFUTUREPROOFING5,
							contextualText: annotation.ZANNOTATIONREPRESENTATIVETEXT,
							highlight: annotation.ZANNOTATIONSELECTEDTEXT,
							note: annotation.ZANNOTATIONNOTE,
							highlightStyle: annotation.ZANNOTATIONSTYLE,
							highlightCreationDate: annotation.ZANNOTATIONCREATIONDATE,
							highlightModificationDate: annotation.ZANNOTATIONMODIFICATIONDATE
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
		
		if (highlights.length === 0) {
			throw ('No highlights found. Make sure you made some highlights in your Apple Books.');
		}
		
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
			// TODO: Consider moving to a separate file if there are several helpers to be added 
			Handlebars.registerHelper('eq', (a, b) => {
				if (a == b) {
					return this;
				}
			});
			
			Handlebars.registerHelper('dateFormat', (date, format) => {
				return dayjs('2001-01-01').add(date, 's').format(format);
			});
				
			const template = Handlebars.compile(this.settings.template);
			const renderedTemplate = template(highlight);

			await this.app.vault.create(
				normalizePath(path.join(this.settings.highlightsFolder, `${highlight.bookTitle}.md`)),
				renderedTemplate
			);
		});
	}
}
