import type { App } from 'obsidian';
import type { IBookHighlightsPluginSettings } from '../types';

export interface TimingEntry {
  label: string;
  duration: number;
  timestamp: number;
}

export class DiagnosticsCollector {
  private timings: TimingEntry[] = [];
  private app: App;
  private settings: IBookHighlightsPluginSettings;
  private bookCount: number = 0;
  private highlightCount: number = 0;

  constructor(app: App, settings: IBookHighlightsPluginSettings) {
    this.app = app;
    this.settings = settings;
  }

  addTiming(label: string, duration: number) {
    this.timings.push({
      label,
      duration,
      timestamp: Date.now(),
    });
  }

  reset() {
    this.timings = [];
    this.bookCount = 0;
    this.highlightCount = 0;
  }

  setCounts(bookCount: number, highlightCount: number) {
    this.bookCount = bookCount;
    this.highlightCount = highlightCount;
  }

  async writeDiagnosticsToFile(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `diagnostics-${timestamp}.md`;
    const diagnosticsPath = `diagnostics/${filename}`;

    // Create diagnostics folder if it doesn't exist
    const diagnosticsFolder = this.app.vault.getFolderByPath('diagnostics');
    if (!diagnosticsFolder) {
      await this.app.vault.createFolder('diagnostics');
    }

    const content = this.generateDiagnosticsContent();
    await this.app.vault.create(diagnosticsPath, content);
  }

  private generateDiagnosticsContent(): string {
    const totalDuration = this.getTotalDuration();
    const bookCount = this.getBookCountFromTimings();
    const highlightCount = this.getHighlightCountFromTimings();

    let content = '# Apple Books Highlights Import Diagnostics\n\n';
    content += `**Generated:** ${new Date().toLocaleString()}\n\n`;

    content += '## Performance Summary\n\n';
    content += `- **Total Duration:** ${totalDuration.toFixed(2)}ms\n`;
    content += `- **Books Processed:** ${bookCount}\n`;
    content += `- **Highlights Processed:** ${highlightCount}\n`;
    content += `- **Average per Book:** ${(totalDuration / Math.max(bookCount, 1)).toFixed(2)}ms\n`;
    content += `- **Average per Highlight:** ${(totalDuration / Math.max(highlightCount, 1)).toFixed(2)}ms\n\n`;

    content += '## Detailed Timings\n\n';
    content += '| Operation | Duration (ms) | Percentage |\n';
    content += '|-----------|---------------|------------|\n';

    this.timings.forEach((timing) => {
      // biome-ignore lint/style/noMagicNumbers: Temporarily ignore hardcoded numbers until refactored.
      const percentage = ((timing.duration / totalDuration) * 100).toFixed(1);
      content += `| ${timing.label} | ${timing.duration.toFixed(2)} | ${percentage}% |\n`;
    });

    content += '\n## Plugin Configuration\n\n';
    content += `\`\`\`json\n${JSON.stringify(this.settings, null, 2)}\n\`\`\`\n\n`;

    content += '## System Information\n\n';
    content += `- **Platform:** ${navigator.platform}\n`;
    content += `- **User Agent:** ${navigator.userAgent}\n`;
    // biome-ignore lint/style/noMagicNumbers: Temporarily ignore hardcoded numbers until refactored.
    content += `- **Memory:** ${(performance as any).memory ? `${((performance as any).memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB used` : 'N/A'}\n`;

    return content;
  }

  private getTotalDuration(): number {
    // Use the duration of the last "Full Import Cycle" if present, otherwise sum all
    const fullImportTimings = this.timings.filter((t) => t.label.includes('Full Import Cycle'));
    if (fullImportTimings.length > 0) {
      return fullImportTimings[fullImportTimings.length - 1].duration;
    }
    return this.timings.reduce((sum, timing) => sum + timing.duration, 0);
  }

  private getBookCountFromTimings(): number {
    return this.bookCount;
  }

  private getHighlightCountFromTimings(): number {
    return this.highlightCount;
  }
}
