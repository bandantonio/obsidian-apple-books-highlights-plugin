import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import * as Handlebars from 'handlebars';

dayjs.extend(utc);
dayjs.extend(timezone);

export const compileTemplate = (template: string): Handlebars.TemplateDelegate => {
  return Handlebars.compile(template);
};

export const calculateAppleDate = (date: number) => {
  const timeZone = dayjs.tz.guess();
  const APPLE_EPOCH_START = new Date('2001-01-01').getTime();
  const dateInMilliseconds = date * 1000;
  const calculatedDate = dayjs(APPLE_EPOCH_START)
    .add(dateInMilliseconds, 'ms')
    .tz(timeZone || 'UTC');
  return calculatedDate;
};

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
