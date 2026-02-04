export interface IBook {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookGenre: string;
  bookLanguage: string;
  bookLastOpenedDate: number;
  bookFinishedDate: number | null;
  bookCoverUrl: string;
}

export interface IAnnotation {
  assetId: string;
  chapter: string;
  contextualText: string;
  highlight: string;
  note: string | null;
  highlightLocation: string;
  highlightStyle: number;
  highlightCreationDate: number;
  highlightModificationDate: number;
}

export interface IBookWithAnnotations extends IBook {
  annotations: IAnnotation[];
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
