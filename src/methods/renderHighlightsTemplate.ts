import * as Handlebars from 'handlebars';
import { ICombinedBooksAndHighlights } from '../types';
export const renderHighlightsTemplate = async (highlight: ICombinedBooksAndHighlights, template: string) => {
	const compiledTemplate = Handlebars.compile(template);
	const renderedTemplate = compiledTemplate(highlight);

	return renderedTemplate;
}
