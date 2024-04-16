

import dayjs from 'dayjs';
import * as Handlebars from 'handlebars';
import { normalizePath, Notice, Plugin } from 'obsidian';
import path from 'path';
import { DEFAULT_SETTINGS, IBookHighlightsSettingTab } from './src/settings';
import { IBookHighlightsPluginSearchModal } from './src/search';
import { annotationsRequest, dbRequest } from 'src/db/index';
import {
	BOOKS_DB_PATH,
	HIGHLIGHTS_DB_PATH,
	BOOKS_LIBRARY_NAME,
	HIGHLIGHTS_LIBRARY_NAME,
	BOOKS_LIBRARY_COLUMNS,
	HIGHLIGHTS_LIBRARY_COLUMNS
} from './src/db/constants';
import {
	ICombinedBooksAndHighlights,
	IBook,
	IBookAnnotation,
	IBookHighlightsPluginSettings
} from './src/types';

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

	async getBooks(): Promise<IBook[]> {
		const bookDetails = await dbRequest(
			BOOKS_DB_PATH,
			`SELECT ${BOOKS_LIBRARY_COLUMNS.join(', ')} FROM ${BOOKS_LIBRARY_NAME} WHERE ZPURCHASEDATE IS NOT NULL`
		) as IBook[];
		
		return bookDetails;
	}

	async getAnnotations(): Promise<IBookAnnotation[]> {
		const annotationDetails = await annotationsRequest(
			HIGHLIGHTS_DB_PATH,
			`SELECT ${HIGHLIGHTS_LIBRARY_COLUMNS.join(', ')} FROM ${HIGHLIGHTS_LIBRARY_NAME} WHERE ZANNOTATIONSELECTEDTEXT IS NOT NULL AND ZANNOTATIONDELETED IS 0`
		) as IBookAnnotation[];
		
		return annotationDetails;
	}
	
	async aggregateBookAndHighlightDetails(): Promise<ICombinedBooksAndHighlights[]> {
		const books = await this.getBooks();
		const annotations = await this.getAnnotations();
		
		const resultingHighlights: ICombinedBooksAndHighlights[] = books.reduce((highlights: ICombinedBooksAndHighlights[], book: IBook) => {
			const bookRelatedAnnotations: IBookAnnotation[] = annotations.filter(annotation => annotation.ZANNOTATIONASSETID === book.ZASSETID);

			if (bookRelatedAnnotations.length > 0) {
				// Obsidian forbids adding certain characters to the title of a note, so they must be replaced with a dash (-)
				// | # ^ [] \ / :
				// eslint-disable-next-line
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

	async aggregateAndSaveHighlights(): Promise<void> {
		const highlights = await this.aggregateBookAndHighlightDetails();
		
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
