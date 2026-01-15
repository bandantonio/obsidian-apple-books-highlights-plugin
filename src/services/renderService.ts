import * as Handlebars from 'handlebars';
import type { ICombinedBooksAndHighlights, IRenderService } from '../types';
import '../utils/helpers';

export class RenderService implements IRenderService {
  async renderTemplate(highlight: ICombinedBooksAndHighlights, template: string): Promise<string> {
    const compiledTemplate = await Promise.resolve(Handlebars.compile(template));
    const renderedTemplate = compiledTemplate(highlight);

    return renderedTemplate;
  }
}
