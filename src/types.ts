export interface IDataService {
  getBooks(): Promise<IBook[]>;
  getAnnotations(): Promise<IBookAnnotation[]>;
}

export interface IHighlightProcessingService {
  aggregateHighlights(): Promise<ICombinedBooksAndHighlights[]>;
  sortHighlights(highlights: ICombinedBooksAndHighlights, criterion: IHighlightsSortingCriterion): ICombinedBooksAndHighlights;
}

export interface IRenderService {
  renderTemplate(highlight: ICombinedBooksAndHighlights, template: string): Promise<string>;
}

export interface IBook {
  ZASSETID: string;
  ZTITLE: string;
  ZAUTHOR: string;
  ZGENRE: string;
  ZLANGUAGE: string;
  ZLASTOPENDATE: number;
  ZDATEFINISHED: number | null;
  ZCOVERURL: string;
}

export interface IBookAnnotation {
  ZANNOTATIONASSETID: string;
  ZFUTUREPROOFING5: string;
  ZANNOTATIONREPRESENTATIVETEXT: string;
  ZANNOTATIONSELECTEDTEXT: string;
  ZANNOTATIONLOCATION: string;
  ZANNOTATIONNOTE: string | null;
  ZANNOTATIONCREATIONDATE: number;
  ZANNOTATIONMODIFICATIONDATE: number;
  ZANNOTATIONSTYLE: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface IHighlight {
  chapter: string;
  contextualText: string;
  highlight: string;
  highlightLocation: string;
  note: string | null;
  highlightStyle: IBookAnnotation['ZANNOTATIONSTYLE'];
  highlightCreationDate: number;
  highlightModificationDate: number;
}
export interface ICombinedBooksAndHighlights {
  bookTitle: string;
  bookId: string;
  bookAuthor: string;
  bookGenre: string;
  bookLanguage: string;
  bookLastOpenedDate: number;
  bookFinishedDate: number | null;
  bookCoverUrl: string;
  annotations: IHighlight[];
}

export enum IHighlightsSortingCriterion {
  CreationDateOldToNew = 'creationDateOldToNew',
  CreationDateNewToOld = 'creationDateNewToOld',
  LastModifiedDateOldToNew = 'lastModifiedDateOldToNew',
  LastModifiedDateNewToOld = 'lastModifiedDateNewToOld',
  Book = 'book',
}

export interface IBookHighlightsPluginSettings {
  highlightsFolder: string;
  backup: boolean;
  importOnStart: boolean;
  highlightsSortingCriterion: IHighlightsSortingCriterion;
  template: string;
  filenameTemplate: string;
}
