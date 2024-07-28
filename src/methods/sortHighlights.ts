import { IHighlight, ICombinedBooksAndHighlights, IHighlightsSortingCriterion } from 'src/types';

export const sortHighlights = (combinedHighlight: ICombinedBooksAndHighlights, highlightsSortingCriterion: string) => {
	let sortedHighlights: IHighlight[] = [];

	switch (highlightsSortingCriterion) {
		case IHighlightsSortingCriterion.CreationDateOldToNew:
			sortedHighlights = combinedHighlight.annotations.sort((a, b) => a.highlightCreationDate - b.highlightCreationDate);
			break;
		case IHighlightsSortingCriterion.CreationDateNewToOld:
			sortedHighlights = combinedHighlight.annotations.sort((a, b) => b.highlightCreationDate - a.highlightCreationDate);
			break;
		case IHighlightsSortingCriterion.LastModifiedDateOldToNew:
			sortedHighlights = combinedHighlight.annotations.sort((a, b) => a.highlightModificationDate - b.highlightModificationDate);
			break;
		case IHighlightsSortingCriterion.LastModifiedDateNewToOld:
			sortedHighlights = combinedHighlight.annotations.sort((a, b) => b.highlightModificationDate - a.highlightModificationDate);
			break;
		case IHighlightsSortingCriterion.Book:
			sortedHighlights = combinedHighlight.annotations.sort((a, b) => {
				const firstHighlightLocation = highlightLocationToNumber(a.highlightLocation);
				const secondHighlightLocation = highlightLocationToNumber(b.highlightLocation);

				return compareLocations(firstHighlightLocation, secondHighlightLocation);
			});
			break;
	}

	return {
		...combinedHighlight,
		annotations: sortedHighlights
	};
}

// The function converts a highlight location string to an array of numbers
export const highlightLocationToNumber = (highlightLocation: string): number[] => {
	// epubcfi example structure: epubcfi(/6/2[body01]!/4/2/2/1:0)
	return highlightLocation
		.slice(8, -1)	// Get rid of the epubcfi() wrapper
		.split(',')		// Split the locator into three parts: the common parent, the start subpath, and the end subpath
		.slice(0, -1)	// Get rid of the end subpath (third part)
		.join(',')		// Join the first two parts back together
		.match(/(?<!\[)[/:]\d+(?!\])/g)!  		 // Extract all the numbers (except those in square brackets) from the first two parts
		.map(match => parseInt(match.slice(1)))	 // Get rid of the leading slash or colon and convert the string to a number
}

// The function performs lexicographic comparison of two locations to determine their relative position in a book
export const compareLocations = (firstLocation: number[], secondLocation: number[]) => {
	// Loop through each element of both arrays up to the length of the shorter one
	for (let i = 0; i < Math.min(firstLocation.length, secondLocation.length); i++) {
		if (firstLocation[i] < secondLocation[i]) {
			return -1;
		}
		if (firstLocation[i] > secondLocation[i]) {
			return 1;
		}
	}

	// If the loop didn't return, the arrays are equal up to the length of the shorter array
	// so the function returns the difference in lengths to determine the order of the corresponding locations
	return firstLocation.length - secondLocation.length;
}
