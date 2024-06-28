import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Handlebars from 'handlebars';

(() => {
// TODO: Consider moving to a separate file if there are several helpers to be added
	Handlebars.registerHelper('eq', function (a, b) {
		if (a == b) {
			return this;
		}
	});

	// TODO: Consider using out-of-the-box date validation via https://day.js.org/docs/en/parse/is-valid
	Handlebars.registerHelper('dateFormat', (date, format) => {
		dayjs.extend(utc);
		dayjs.extend(timezone);

		const timeZone = dayjs.tz.guess();

		const APPLE_EPOCH_START = new Date('2001-01-01').getTime();
		const dateInMilliseconds = date * 1000;
		const calculatedDate = dayjs(APPLE_EPOCH_START)
			.add(dateInMilliseconds, 'ms')
			.tz(timeZone || 'UTC');

		const formattedDate = calculatedDate.format(format);

		return formattedDate;
	});
})();
