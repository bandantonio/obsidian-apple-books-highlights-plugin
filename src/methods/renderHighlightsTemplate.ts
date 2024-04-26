import dayjs from 'dayjs';
import * as Handlebars from "handlebars";
import { ICombinedBooksAndHighlights } from '../types';
export const renderHighlightsTemplate = async (highlight: ICombinedBooksAndHighlights, template: string) => {
	// TODO: Consider moving to a separate file if there are several helpers to be added
	Handlebars.registerHelper("eq", function(a, b) {
		if (a == b) {
			return this;
		}
	});

	Handlebars.registerHelper("dateFormat", (date, format) => {
		return dayjs("2001-01-01").add(date, "s").format(format);
	});

	const compiledTemplate = Handlebars.compile(template);
	const renderedTemplate = compiledTemplate(highlight);

	return renderedTemplate;
}
