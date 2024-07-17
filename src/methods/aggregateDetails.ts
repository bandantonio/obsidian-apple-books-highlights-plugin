import { IBook, IBookAnnotation, ICombinedBooksAndHighlights } from '../types';
import { getBooks } from './getBooks';
import { getAnnotations } from './getAnnotations';
import { preserveNewlineIndentation, removeTrailingSpaces } from 'src/utils'

export const aggregateBookAndHighlightDetails = async (): Promise<ICombinedBooksAndHighlights[]> => {
	const books = await getBooks();
	const annotations = await getAnnotations();

	const resultingHighlights: ICombinedBooksAndHighlights[] = books.reduce((highlights: ICombinedBooksAndHighlights[], book: IBook) => {
		const bookRelatedAnnotations: IBookAnnotation[] = annotations.filter((annotation: IBookAnnotation) => annotation.ZANNOTATIONASSETID === book.ZASSETID);

		if (bookRelatedAnnotations.length > 0) {
			// Obsidian forbids adding certain characters to the title of a note, so they must be replaced with a dash (-)
			// | # ^ [] \ / :
			// after the replacement, two or more spaces are replaced with a single one
			// eslint-disable-next-line
			const normalizedBookTitle = book.ZTITLE.replace(/[\|\#\^\[\]\\\/\:]+/g, ' -').replace(/\s{2,}/g, ' ');

			highlights.push({
				bookTitle: normalizedBookTitle,
				bookId: book.ZASSETID,
				bookAuthor: book.ZAUTHOR,
				bookGenre: book.ZGENRE,
				bookLanguage: book.ZLANGUAGE,
				bookLastOpenedDate: book.ZLASTOPENDATE,
				bookCoverUrl: book.ZCOVERURL,
				annotations: bookRelatedAnnotations.map(annotation => {
					const textForContext = annotation.ZANNOTATIONREPRESENTATIVETEXT;
					const userNote = annotation.ZANNOTATIONNOTE;

					return {
						chapter: annotation.ZFUTUREPROOFING5,
						contextualText: textForContext ? removeTrailingSpaces(preserveNewlineIndentation(textForContext)) : textForContext,
						highlight: preserveNewlineIndentation(annotation.ZANNOTATIONSELECTEDTEXT),
						note: userNote ? preserveNewlineIndentation(userNote) : userNote,
						highlightLocation: annotation.ZANNOTATIONLOCATION,
						highlightStyle: annotation.ZANNOTATIONSTYLE,
						highlightCreationDate: annotation.ZANNOTATIONCREATIONDATE,
						highlightModificationDate: annotation.ZANNOTATIONMODIFICATIONDATE
					}
				})
			})
		}

		return highlights;
	}, []);

	return resultingHighlights;
};
