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
	"ZANNOTATIONREPRESENTATIVETEXT": "This is a contextual text for the aggregated highlight from the Apple iPhone User Guide",
	"ZANNOTATIONSELECTEDTEXT": "aggregated highlight from the Apple iPhone User Guide",
	"ZANNOTATIONLOCATION": "aggregated-highlight-link-from-the-apple-iphone-user-guide",
	"ZANNOTATIONNOTE": "Test note for the aggregated highlight from the Apple iPhone User Guide",
	"ZANNOTATIONCREATIONDATE": 731876693.002279,
	"ZANNOTATIONMODIFICATIONDATE": 731876693.002279,
	"ZANNOTATIONSTYLE": 3,
	"ZANNOTATIONDELETED": 0
}, {
	"ZANNOTATIONASSETID": "THBFYNJKTGFTTVCGSAE5",
	"ZFUTUREPROOFING5": "Another aggregated Introduction",
	"ZANNOTATIONREPRESENTATIVETEXT": "This is a contextual text for the aggregated highlight from the Apple iPhone User Guide\n\ncontaining a new line to test the preservation of indentation",
	"ZANNOTATIONSELECTEDTEXT": "aggregated highlight from the Apple iPhone User Guide\n\ncontaining a new line to test the preservation of indentation\n\nand another new line\n\nto check one more time",
	"ZANNOTATIONLOCATION": "aggregated-highlight-link-from-the-apple-iphone-user-guide",
	"ZANNOTATIONNOTE": "Test note for the aggregated highlight from the Apple iPhone User Guide\n\nalong with a new line to test the preservation of indentation",
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
		"contextualText": "This is a contextual text for the aggregated highlight from the Apple iPhone User Guide",
		"highlight": "aggregated highlight from the Apple iPhone User Guide",
		"note": "Test note for the aggregated highlight from the Apple iPhone User Guide",
		"highlightLocation": "aggregated-highlight-link-from-the-apple-iphone-user-guide",
		"highlightStyle": 3,
		"highlightCreationDate": 731876693.002279,
		"highlightModificationDate": 731876693.002279
	}, {
		"chapter": "Another aggregated Introduction",
		"contextualText": "This is a contextual text for the aggregated highlight from the Apple iPhone User Guide\ncontaining a new line to test the preservation of indentation",
		"highlight": "aggregated highlight from the Apple iPhone User Guide\ncontaining a new line to test the preservation of indentation\nand another new line\nto check one more time",
		"note": "Test note for the aggregated highlight from the Apple iPhone User Guide\nalong with a new line to test the preservation of indentation",
		"highlightLocation": "aggregated-highlight-link-from-the-apple-iphone-user-guide",
		"highlightStyle": 3,
		"highlightCreationDate": 731876693.002279,
		"highlightModificationDate": 731876693.002279
	}]
}];
