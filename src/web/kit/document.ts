import * as vscode from 'vscode';

export class Document {

  // ─── Editor ──────────────────────────────────────────────────────────

  static get #editor() {
    return vscode.window.activeTextEditor!;
  }

  // ─── Document Size ───────────────────────────────────────────────────

  static get documentLineCount(): number {
    return this.#editor.document.lineCount;
  }

  // ─── Position ────────────────────────────────────────────────────────

  static get currentLine(): number {
    return this.#editor.selection.active.line;
  }

  static get currentColumn(): number {
    return this.#editor.selection.active.character;
  }

  // ─── Tab Size ────────────────────────────────────────────────────────

  static get tabSize(): number {
    const editorTabSetting = this.#editor.options.tabSize;
    const currentTabSize   = typeof editorTabSetting === 'number'
                             ? editorTabSetting : 2;
    return currentTabSize;
  }

  // ─── Get Line At ─────────────────────────────────────────────────────

  static contentOfLine(line: number): string {
    return this.#editor.document.lineAt(line).text;
  }

  // ─── Get The Upper Line ──────────────────────────────────────────────

  static get contentOfTheFirstFilledLineAbove(): string {
    if (this.currentLine === 0) {
      return '';
    }
    for (let index = this.currentLine - 1; index >= 0; index--) {
      if (this.#lineIsNotEmptyAt(index)) {
        return this.contentOfLine(index);
      }
    }
    return '';
  }

  // ─── Get The Downer Line ─────────────────────────────────────────────

  static get contentOfTheFirstFilledLineBelow(): string {
    if (this.currentLine === 0) {
      return '';
    }

    const lineCount = this.documentLineCount;
    for (let index = this.currentLine + 1; index < lineCount; index++) {
      if (this.#lineIsNotEmptyAt(index)) {
        return this.contentOfLine(index);
      }
    }
    return '';
  }

  // ─── Current Line ────────────────────────────────────────────────────

  static get currentLineContent(): string {
    return this.contentOfLine(this.currentLine);
  }


  // ─── Is Line Not Empty ───────────────────────────────────────────────

  static #lineIsNotEmptyAt(line: number): boolean {
    return /^\s*$/.test(Document.contentOfLine(line)) === false;
  }
}
