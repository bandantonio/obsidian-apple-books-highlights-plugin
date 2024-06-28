export const booksToAggregate = [{
	"ZASSETID": "THBFYNJKTGFTTVCGSAE5",
	"ZTITLE": "Apple iPhone: User Guide | Instructions ^ with # restricted [ symbols ] in \ / title",	// eslint-disable-line
	"ZAUTHOR": "Apple Inc.",
	"ZGENRE": "Technology",
	"ZLANGUAGE": "EN",
	"ZLASTOPENDATE": 731876693.002279,
	"ZCOVERURL": ''
}];

export const annotationsToAggregate = [{
	"ZANNOTATIONASSETID": "THBFYNJKTGFTTVCGSAE5",
	"ZFUTUREPROOFING5": "Aggregated Introduction",
	"ZANNOTATIONREPRESENTATIVETEXT": "This is a contextual text for the aggregated hightlight from the Apple iPhone User Guide",
	"ZANNOTATIONSELECTEDTEXT": "aggregated hightlight from the Apple iPhone User Guide",
	"ZANNOTATIONNOTE": "Test note for the aggregated hightlight from the Apple iPhone User Guide",
	"ZANNOTATIONCREATIONDATE": 731876693.002279,
	"ZANNOTATIONMODIFICATIONDATE": 731876693.002279,
	"ZANNOTATIONSTYLE": 3,
	"ZANNOTATIONDELETED": 0
}, {
	"ZANNOTATIONASSETID": "THBFYNJKTGFTTVCGSAE5",
	"ZFUTUREPROOFING5": "Another aggregated Introduction",
	"ZANNOTATIONREPRESENTATIVETEXT": "This is a contextual text for the aggregated hightlight from the Apple iPhone User Guide\n\ncontaining a new line to test the preservation of indentation",
	"ZANNOTATIONSELECTEDTEXT": "aggregated hightlight from the Apple iPhone User Guide\n\ncontaining a new line to test the preservation of indentation",
	"ZANNOTATIONNOTE": "Test note for the aggregated hightlight from the Apple iPhone User Guide\n\nalong with a new line to test the preservation of indentation",
	"ZANNOTATIONCREATIONDATE": 731876693.002279,
	"ZANNOTATIONMODIFICATIONDATE": 731876693.002279,
	"ZANNOTATIONSTYLE": 3,
	"ZANNOTATIONDELETED": 0
}];

export const aggregatedHighlights = [{
	"bookTitle": "Apple iPhone - User Guide - Instructions - with - restricted - symbols - in - title",
	"bookId": "THBFYNJKTGFTTVCGSAE5",
	"bookAuthor": "Apple Inc.",
	"bookGenre": "Technology",
	"bookLanguage": "EN",
	"bookLastOpenedDate": 731876693.002279,
	"bookCoverUrl": '',
	"annotations": [{
		"chapter": "Aggregated Introduction",
		"contextualText": "This is a contextual text for the aggregated hightlight from the Apple iPhone User Guide",
		"highlight": "aggregated hightlight from the Apple iPhone User Guide",
		"note": "Test note for the aggregated hightlight from the Apple iPhone User Guide",
		"highlightStyle": 3,
		"highlightCreationDate": 731876693.002279,
		"highlightModificationDate": 731876693.002279
	}, {
		"chapter": "Another aggregated Introduction",
		"contextualText": "This is a contextual text for the aggregated hightlight from the Apple iPhone User Guide\ncontaining a new line to test the preservation of indentation",
		"highlight": "aggregated hightlight from the Apple iPhone User Guide\ncontaining a new line to test the preservation of indentation",
		"note": "Test note for the aggregated hightlight from the Apple iPhone User Guide\nalong with a new line to test the preservation of indentation",
		"highlightStyle": 3,
		"highlightCreationDate": 731876693.002279,
		"highlightModificationDate": 731876693.002279
	}]
}];
