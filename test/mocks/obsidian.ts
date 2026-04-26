import { vi } from 'vitest';

export const NoticeMock = vi.fn();
export class Notice {
  constructor(...args: any[]) {
    return NoticeMock(...args);
  }
}

export class Plugin {
  app: App = new App();
  addRibbonIcon() {}
  addCommand() {}
  addSettingTab() {}
  loadData() {
    return {};
  }
  saveData() {}
  registerEvent() {}
}

export class SuggestModal<T> {
  app: App;
  constructor(app: App) {
    this.app = app;
  }
  open() {}
  close() {}
  getSuggestions(_query: string): T[] | Promise<T[]> {
    return [];
  }
}

export function setIcon(): void {}

export class App {}
export class PluginSettingTab {}
export class Setting {}

export class Modal {
  app: App;
  constructor(app: App) {
    this.app = app;
  }
  open() {}
  close() {}
}

export class TFile {
  path: string = '';
  name: string = '';
}
