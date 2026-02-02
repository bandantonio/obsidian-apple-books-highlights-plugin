export const bookOne = {
  id: 'THBFYNJKTGFTTVCGSAE1',
  title: 'iPhone User Guide',
  author: 'Apple Inc.',
  genre: 'Technology',
  language: 'EN',
  lastOpenedDate: 726602576.413094,
  finishedDate: 726602576.413094,
  coverUrl: '',
};

export const bookTwo = {
  id: 'THBFYNJKTGFTTVCGSAE2',
  title: 'iPad User Guide',
  author: 'Apple Inc.',
  genre: 'Technology',
  language: 'EN',
  lastOpenedDate: 726602576.413094,
  finishedDate: 726602576.413094,
  coverUrl: '',
};

export const bookThree = {
  id: 'THBFYNJKTGFTTVCGSAE3',
  title: 'Mac User Guide',
  author: 'Apple Inc.',
  genre: 'Technology',
  language: 'EN',
  lastOpenedDate: 726602576.413094,
  finishedDate: 726602576.413094,
  coverUrl: '',
};

export const bookFour = {
  id: 'THBFYNJKTGFTTVCGSAE4',
  title: 'Non-Purchased Book',
  author: 'John Doe',
  genre: 'Fiction',
  language: 'EN',
  lastOpenedDate: 726602576.413094,
  finishedDate: 726602576.413094,
  coverUrl: '',
  ZPURCHASEDATE: null,
};

export const bookFive = {
  id: 'THBFYNJKTGFTTVCGSAE5',
  title: 'A book with no annotations',
  author: 'Jane Doe',
  genre: 'Non-Fiction',
  language: 'EN',
  lastOpenedDate: 726602576.413094,
  finishedDate: 726602576.413094,
  coverUrl: '',
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