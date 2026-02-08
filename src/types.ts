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

export type IHighlightsSortingCriterion =
  | 'creationDateOldToNew'      // Default. The highlights that were created first will be at the top.
  | 'creationDateNewToOld'      // The highlights that were created last will be at the top.
  | 'lastModifiedDateOldToNew'  // The highlights that were modified first will be at the top.
  | 'lastModifiedDateNewToOld'  // The highlights that were modified last will be at the top.
  | 'book';                     // Highlights are sorted by their location in a book.

export interface IBookHighlightsPluginSettings {
  highlightsFolder: string;
  backup: boolean;
  importOnStart: boolean;
  highlightsSortingCriterion: IHighlightsSortingCriterion;
  template: string;
  filenameTemplate: string;
}
