import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Handlebars from 'handlebars';

export const calculateAppleDate = (date: number) => {
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const timeZone = dayjs.tz.guess();

	const APPLE_EPOCH_START = new Date('2001-01-01').getTime();
	const dateInMilliseconds = date * 1000;
	const calculatedDate = dayjs(APPLE_EPOCH_START)
		.add(dateInMilliseconds, 'ms')
		.tz(timeZone || 'UTC');

	return calculatedDate;
}

(() => {
	Handlebars.registerHelper('eq', function (a, b) {
		if (a == b) {
			return this;
		}
	});

	// TODO: Consider using out-of-the-box date validation via https://day.js.org/docs/en/parse/is-valid
	Handlebars.registerHelper('dateFormat', (date, format) => {
		const calculatedDate = calculateAppleDate(date);
		const formattedDate = calculatedDate.format(format);

		return formattedDate;
	});

	// Assumption: contextualText always contains highlight.
	// If that assumption is broken, return `null`
	Handlebars.registerHelper('contextBefore', (highlight: string, contextualText: string) => {
		const start = contextualText.indexOf(highlight);
		if (start < 0) {
			return null;
		}
		return contextualText.slice(0, start);
	});
	Handlebars.registerHelper('contextAfter', (highlight: string, contextualText: string) => {
		const start = contextualText.indexOf(highlight);
		if (start < 0) {
			return null;
		}
		return contextualText.slice(start + highlight.length);
	});
})();
