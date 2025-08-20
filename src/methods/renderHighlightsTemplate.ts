import * as Handlebars from 'handlebars';
import type { ICombinedBooksAndHighlights } from '../types';
import '../utils/helpers';

// biome-ignore lint/suspicious/useAwait: temp ignore to pass linter check
export const renderHighlightsTemplate = async (highlight: ICombinedBooksAndHighlights, template: string) => {
  const compiledTemplate = Handlebars.compile(template);
  const renderedTemplate = compiledTemplate(highlight);

  return renderedTemplate;
};
