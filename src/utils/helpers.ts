import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Handlebars from 'handlebars';

// TODO: Consider simplifying calculations inside the function and adding unit tests for it.
// Remove ignore comment when done.
export const calculateAppleDate = (date: number) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const timeZone = dayjs.tz.guess();

  const APPLE_EPOCH_START = new Date('2001-01-01').getTime();
  // biome-ignore lint/style/noMagicNumbers: Temporarily ignore hardcoded numbers until refactored.
  const dateInMilliseconds = date * 1000;
  const calculatedDate = dayjs(APPLE_EPOCH_START)
    .add(dateInMilliseconds, 'ms')
    .tz(timeZone || 'UTC');

  return calculatedDate;
};

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
})();
