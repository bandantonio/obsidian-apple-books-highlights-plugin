export const bookOne = {
  bookId: 'THBFYNJKTGFTTVCGSAE1',
  bookTitle: 'iPhone User Guide',
  bookAuthor: 'Apple Inc.',
  bookGenre: 'Technology',
  bookLanguage: 'EN',
  bookLastOpenedDate: 726602576.413094,
  bookFinishedDate: 726602576.413094,
  bookCoverUrl: '',
};

export const bookTwo = {
  bookId: 'THBFYNJKTGFTTVCGSAE2',
  bookTitle: 'iPad User Guide',
  bookAuthor: 'Apple Inc.',
  bookGenre: 'Technology',
  bookLanguage: 'EN',
  bookLastOpenedDate: 726602576.413094,
  bookFinishedDate: 726602576.413094,
  bookCoverUrl: '',
};

export const bookThree = {
  bookId: 'THBFYNJKTGFTTVCGSAE3',
  bookTitle: 'Mac User Guide',
  bookAuthor: 'Apple Inc.',
  bookGenre: 'Technology',
  bookLanguage: 'EN',
  bookLastOpenedDate: 726602576.413094,
  bookFinishedDate: 726602576.413094,
  bookCoverUrl: '',
};

export const bookFour = {
  bookId: 'THBFYNJKTGFTTVCGSAE4',
  bookTitle: 'Non-Purchased Book',
  bookAuthor: 'John Doe',
  bookGenre: 'Fiction',
  bookLanguage: 'EN',
  bookLastOpenedDate: 726602576.413094,
  bookFinishedDate: 726602576.413094,
  bookCoverUrl: '',
  ZPURCHASEDATE: null,
};

export const bookFive = {
  bookId: 'THBFYNJKTGFTTVCGSAE5',
  bookTitle: 'A book with no annotations',
  bookAuthor: 'Jane Doe',
  bookGenre: 'Non-Fiction',
  bookLanguage: 'EN',
  bookLastOpenedDate: 726602576.413094,
  bookFinishedDate: 726602576.413094,
  bookCoverUrl: '',
};

export const bookSix = {
  bookId: 'THBFYNJKTGFTTVCGSAE6',
  bookTitle: 'A book to test sorting feature',
  bookAuthor: 'Joanne Doe',
  bookGenre: 'Non-Fiction',
  bookLanguage: 'EN',
  bookLastOpenedDate: 726602576.413094,
  bookFinishedDate: 726602576.413094,
  bookCoverUrl: '',
}

export const books = [
  bookOne,
  bookTwo,
  bookThree,
  bookFour,
  bookFive,
  bookSix,
];

export const purchasedBooks = [
  bookOne,
  bookTwo,
  bookThree,
  bookFive,
  bookSix,
]

export const annotationOne = {
  assetId: 'THBFYNJKTGFTTVCGSAE1',
  chapter: 'Introduction',
  contextualText: 'This is a contextual text for the highlight from the iPhone User Guide',
  highlight: 'highlight from the iPhone User Guide',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/32/2/1,:0,:48)',
  note: 'Test note for the highlight from the iPhone User Guide',
  highlightCreationDate: 685151385.91602,
  highlightModificationDate: 685151385.91602,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 0,
};

export const annotationOneDeleted = {
  assetId: 'THBFYNJKTGFTTVCGSAE1',
  chapter: 'Introduction',
  contextualText: 'This is a contextual text for the highlight from the iPhone User Guide',
  highlight: 'highlight from the iPhone User Guide',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/32/2/1,:0,:48)',
  note: 'Test note for the deleted highlight from the iPhone User Guide',
  highlightCreationDate: 685151385.91602,
  highlightModificationDate: 685151385.91602,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 1,
};

export const annotationTwo = {
  assetId: 'THBFYNJKTGFTTVCGSAE2',
  chapter: 'Introduction',
  contextualText: 'This is a contextual text for the highlight from the iPad User Guide',
  highlight: 'highlight from the iPad User Guide',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/32/2/1,:0,:48)',
  note: 'Test note for the highlight from the iPad User Guide',
  highlightCreationDate: 685151385.91602,
  highlightModificationDate: 685151385.91602,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 0,
};

export const annotationTwoDeleted = {
  assetId: 'THBFYNJKTGFTTVCGSAE2',
  chapter: 'Introduction',
  contextualText: 'This is a contextual text for the highlight from the iPad User Guide',
  highlight: 'highlight from the iPad User Guide',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/32/2/1,:0,:48)',
  note: 'Test note for the deleted highlight from the iPad User Guide',
  highlightCreationDate: 685151385.91602,
  highlightModificationDate: 685151385.91602,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 1,
};

export const annotationThree = {
  assetId: 'THBFYNJKTGFTTVCGSAE3',
  chapter: 'Introduction',
  contextualText: 'This is a contextual text for the highlight from the Mac User Guide',
  highlight: 'highlight from the Mac User Guide',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/32/2/1,:0,:48)',
  note: 'Test note for the highlight from the Mac User Guide',
  highlightCreationDate: 685151385.91602,
  highlightModificationDate: 685151385.91602,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 0,
};

export const annotationThreeDuplicate = {
  assetId: 'THBFYNJKTGFTTVCGSAE3',
  chapter: 'Introduction duplicate',
  contextualText: 'This is a contextual text for the duplicated highlight from the Mac User Guide',
  highlight: 'duplicated highlight from the Mac User Guide',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/32/2/1,:0,:48)',
  note: 'Test note for the duplicated highlight from the Mac User Guide',
  highlightCreationDate: 685151385.91602,
  highlightModificationDate: 685151385.91602,
  highlightStyle: 2,
  ZANNOTATIONDELETED: 0,
};

export const annotationThreeDeleted = {
  assetId: 'THBFYNJKTGFTTVCGSAE3',
  chapter: 'Introduction',
  contextualText: 'This is a contextual text for the highlight from the Mac User Guide',
  highlight: 'highlight from the Mac User Guide',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/32/2/1,:0,:48)',
  note: 'Test note for the deleted highlight from the Mac User Guide',
  highlightCreationDate: 685151385.91602,
  highlightModificationDate: 685151385.91602,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 1,
};

export const annotationToSortFirst = {
  assetId: 'THBFYNJKTGFTTVCGSAE6',
  chapter: 'Chapter 1',
  contextualText: 'Highlight that was created first and modified last',
  highlight: 'Highlight that was created first and modified last',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/16/1,:0,:87)',
  note: 'Modification note',
  highlightCreationDate: 743629925.898202,
  highlightModificationDate: 743640744.124985,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 0,
};

export const annotationToSortSecond = {
  assetId: 'THBFYNJKTGFTTVCGSAE6',
  chapter: 'Chapter 1',
  contextualText: 'Highlight that was created second and modified third',
  highlight: 'Highlight that was created second and modified third',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/10,/1:0,/3:76)',
  note: 'Another modification note',
  highlightCreationDate: 743629937.38764,
  highlightModificationDate: 743640715.281904,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 0,
};

export const annotationToSortThird = {
  assetId: 'THBFYNJKTGFTTVCGSAE6',
  chapter: 'Chapter 1',
  contextualText: 'Highlight that was created third and modified first',
  highlight: 'Highlight that was created third and modified first',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/22/1,:0,:125)',
  note: 'Yet another modification note',
  highlightCreationDate: 743629949.224146,
  highlightModificationDate: 743629949.224197,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 0,
};

export const annotationToSortFourth = {
  assetId: 'THBFYNJKTGFTTVCGSAE6',
  chapter: 'Chapter 1',
  contextualText: 'Highlight that was created last and modified second',
  highlight: 'Highlight that was created last and modified second',
  highlightLocation: 'epubcfi(/6/12[chapter1]!/4/2/4,/1:0,/3:45)',
  note: 'Some note',
  highlightCreationDate: 743629954.550827,
  highlightModificationDate: 743629954.550869,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 0,
};

export const annotationsFromDb = [
  annotationOne,
  annotationOneDeleted,
  annotationTwo,
  annotationTwoDeleted,
  annotationThree,
  annotationThreeDuplicate,
  annotationThreeDeleted,
  annotationToSortFirst,
  annotationToSortSecond,
  annotationToSortThird,
  annotationToSortFourth,
];

export const notDeletedAnnotations = annotationsFromDb
  .filter(annotation => annotation.ZANNOTATIONDELETED === 0)
  .map(({ ZANNOTATIONDELETED, ...rest }) => rest);

const [
  firstDummy,
  secondDummy,
  thirdDummy,
  thirdDuplicateDummy,
  sortedFirst,
  sortedSecond,
  sortedThird,
  sortedFourth,
] = notDeletedAnnotations;

export const annotationsSortedByCreationDateNewToOld = [
  sortedFourth,
  sortedThird,
  sortedSecond,
  sortedFirst,
  firstDummy,
  secondDummy,
  thirdDummy,
  thirdDuplicateDummy,
];

export const annotationsSortedByLastModifiedDateOldToNew = [
  firstDummy,
  secondDummy,
  thirdDummy,
  thirdDuplicateDummy,
  sortedThird,
  sortedFourth,
  sortedSecond,
  sortedFirst,
];

export const annotationsSortedByLastModifiedDateNewToOld = [
  sortedFirst,
  sortedSecond,
  sortedFourth,
  sortedThird,
  firstDummy,
  secondDummy,
  thirdDummy,
  thirdDuplicateDummy,
];

export const annotationsSortedByLocation = [
  sortedFourth,
  sortedSecond,
  sortedFirst,
  sortedThird,
  firstDummy,
  secondDummy,
  thirdDummy,
  thirdDuplicateDummy,
];