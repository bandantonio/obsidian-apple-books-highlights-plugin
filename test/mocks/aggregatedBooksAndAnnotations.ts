import {
  bookOne,
  bookTwo,
  bookThree,
  annotationOne,
  annotationTwo,
  annotationThree,
  annotationThreeDuplicate,
} from './dataFetch';

const mappedAnnotations = [
  annotationOne,
  annotationTwo,
  annotationThree,
  annotationThreeDuplicate
].map(annotation => {
  const { assetId, chapter, contextualText, highlight, note, highlightLocation, highlightStyle, highlightCreationDate, highlightModificationDate } = annotation;
  
  return {
    assetId,
    chapter,
    contextualText,
    highlight,
    highlightLocation,
    note,
    highlightCreationDate,
    highlightModificationDate,
    highlightStyle,
  };
});
export const aggregatedBooksAndAnnotations = [
  { ...bookOne, annotations: [mappedAnnotations[0]] },
  { ...bookTwo, annotations: [mappedAnnotations[1]] },
  { ...bookThree, annotations: [mappedAnnotations[2], mappedAnnotations[3]] },
];