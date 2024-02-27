export interface IBookHighlightsPluginSettings {
    highlightsFolder: string;
    template: string;
    backup: boolean;
}

export interface IBook {
    ZASSETID: string;
    ZTITLE: string;
    ZAUTHOR: string;
    ZGENRE: string;
    ZLANGUAGE: string;
    ZLASTOPENDATE: string;
    ZCOVERURL: string;
}

export interface IBookAnnotation {
    ZANNOTATIONASSETID: string;
    ZFUTUREPROOFING5: string;
    ZANNOTATIONREPRESENTATIVETEXT: string;
    ZANNOTATIONSELECTEDTEXT: string;
    ZANNOTATIONNOTE: string;
}

export interface Highlight {
    chapter: string;
    contextualText: string;
    highlight: string;
    note: string;
    annotationDate: string;
    annotationStyle: number;
}
export interface CombinedHighlight {
    bookTitle: string;
    bookId: string;
    bookAuthor: string;
    annotations: Highlight[];
}