import type { DiagnosticsCollector } from './diagnostics';

export class Timer {
  private startTime: number = 0;
  private label: string;
  private diagnosticsCollector?: DiagnosticsCollector;

  constructor(label: string, diagnosticsCollector?: DiagnosticsCollector) {
    this.label = label;
    this.diagnosticsCollector = diagnosticsCollector;
  }

  start() {
    this.startTime = performance.now();
  }

  end(): number {
    const duration = performance.now() - this.startTime;

    if (this.diagnosticsCollector) {
      this.diagnosticsCollector.addTiming(this.label, duration);
    } else {
      // Fallback to console logging if no collector provided
      // biome-ignore lint/suspicious/noConsole: Performance logging is intentional
      console.log(`${this.label} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }
}
