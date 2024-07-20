export interface IBook {
    ZASSETID: string;
    ZTITLE: string;
    ZAUTHOR: string;
    ZGENRE: string;
    ZLANGUAGE: string;
    ZLASTOPENDATE: number;
    ZCOVERURL: string;
}

export interface IBookAnnotation {
    ZANNOTATIONASSETID: string;
    ZFUTUREPROOFING5: string;
    ZANNOTATIONREPRESENTATIVETEXT: string;
    ZANNOTATIONSELECTEDTEXT: string;
    ZANNOTATIONLOCATION: string;
    ZANNOTATIONNOTE: string;
    ZANNOTATIONCREATIONDATE: number;
    ZANNOTATIONMODIFICATIONDATE: number;
    ZANNOTATIONSTYLE: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface IHighlight {
    chapter: string;
    contextualText: string;
    highlight: string;
    highlightLocation: string;
    note: string;
    highlightStyle: IBookAnnotation['ZANNOTATIONSTYLE'],
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
    bookCoverUrl: string;
    annotations: IHighlight[];
}
