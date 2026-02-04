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
}

export const books = [
  bookOne,
  bookTwo,
  bookThree,
  bookFour,
  bookFive,
];

export const purchasedBooks = [
  bookOne,
  bookTwo,
  bookThree,
  bookFive,
]

export const annotationOne = {
  assetId: 'THBFYNJKTGFTTVCGSAE1',
  chapter: 'Introduction',
  contextualText: 'This is a contextual text for the highlight from the iPhone User Guide',
  highlight: 'highlight from the iPhone User Guide',
  highlightLocation: 'test-highlight-link-from-the-iphone-user-guide',
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
  highlightLocation: 'test-highlight-link-from-the-iphone-user-guide',
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
  highlightLocation: 'test-highlight-link-from-the-ipad-user-guide',
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
  highlightLocation: 'test-highlight-link-from-the-ipad-user-guide',
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
  highlightLocation: 'test-highlight-link-from-the-mac-user-guide',
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
  highlightLocation: 'duplicated-test-highlight-link-from-the-mac-user-guide',
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
  highlightLocation: 'test-highlight-link-from-the-mac-user-guide',
  note: 'Test note for the deleted highlight from the Mac User Guide',
  highlightCreationDate: 685151385.91602,
  highlightModificationDate: 685151385.91602,
  highlightStyle: 3,
  ZANNOTATIONDELETED: 1,
};

export const annotationsFromDb = [
  annotationOne,
  annotationOneDeleted,
  annotationTwo,
  annotationTwoDeleted,
  annotationThree,
  annotationThreeDuplicate,
  annotationThreeDeleted,
];

export const notDeletedAnnotations = annotationsFromDb
  .filter(annotation => annotation.ZANNOTATIONDELETED === 0)
  .map(({ ZANNOTATIONDELETED, ...rest }) => rest);