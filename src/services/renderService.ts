import * as Handlebars from 'handlebars';
import type { ICombinedBooksAndHighlights, IRenderService } from '../types';
import '../utils/helpers';

export class RenderService implements IRenderService {
  renderTemplate(highlight: ICombinedBooksAndHighlights, template: string): string {
    const compiledTemplate = Handlebars.compile(template);

    const renderedTemplate = compiledTemplate(highlight);

    return renderedTemplate;
  }
}
