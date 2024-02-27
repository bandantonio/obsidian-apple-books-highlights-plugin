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
    ZLASTOPENDATE: number;
    ZCOVERURL: string;
}

export interface IBookAnnotation {
    ZANNOTATIONASSETID: string;
    ZFUTUREPROOFING5: string;
    ZANNOTATIONREPRESENTATIVETEXT: string;
    ZANNOTATIONSELECTEDTEXT: string;
    ZANNOTATIONNOTE: string;
    ZANNOTATIONMODIFICATIONDATE: number;
}

export interface Highlight {
    chapter: string;
    contextualText: string;
    highlight: string;
    note: string;
    annotationDate: number;
    modificationDate: number;
    annotationStyle: number;
}
export interface CombinedHighlight {
    bookTitle: string;
    bookId: string;
    bookAuthor: string;
    annotations: Highlight[];
}