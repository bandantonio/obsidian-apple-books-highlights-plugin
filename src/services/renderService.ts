import * as Handlebars from 'handlebars';
import type { ICombinedBooksAndHighlights, IRenderService } from '../types';
import '../utils/helpers';
import type { DiagnosticsCollector } from '../utils/diagnostics';
import { Timer } from '../utils/timing';

export class RenderService implements IRenderService {
  private diagnosticsCollector?: DiagnosticsCollector;

  constructor(diagnosticsCollector?: DiagnosticsCollector) {
    this.diagnosticsCollector = diagnosticsCollector;
  }

  renderTemplate(highlight: ICombinedBooksAndHighlights, template: string): string {
    const timer = new Timer('RenderService.renderTemplate');
    timer.start();
    const compiledTemplate = Handlebars.compile(template);
    const renderedTemplate = compiledTemplate(highlight);
    timer.end();
    return renderedTemplate;
  }
}
