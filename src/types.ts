export interface IBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  language: string;
  lastOpenedDate: number;
  finishedDate: number | null;
  coverUrl: string;
}

export interface IAnnotationFromDb extends IAnnotation {
  assetId: string;
  ZANNOTATIONDELETED: number;
}

export interface IAnnotation {
  chapter: string;
  contextualText: string;
  highlight: string;
  highlightLocation: string;
  note: string | null;
  highlightCreationDate: number;
  highlightModificationDate: number;
  highlightStyle: number;
}

export interface IBookWithAnnotations extends IBook {
  annotations: IAnnotation[];
}

export interface IBook{
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
  ZANNOTATIONSTYLE: number;
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
