import * as vscode from 'vscode';

export class Editor {

  // ─── Display Message ─────────────────────────────────────────────────

  static alert(message: string) {
    vscode.window.showInformationMessage(message);
  }

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

  // ─── Current Line ────────────────────────────────────────────────────

  static get currentLineContent(): string {
    return this.contentOfLine(this.currentLine);
  }

  // ─── Insert At ───────────────────────────────────────────────────────

  static async insertAt(position: vscode.Position, text: string) {
    await this.#editor.edit(edit => {
      edit.insert(position, text);
    });
  }

  // ─── Is Line Not Empty ───────────────────────────────────────────────

  static #lineIsNotEmptyAt(line: number): boolean {
    return /^\s*$/.test(Editor.contentOfLine(line)) === false;
  }

  // ─── Delete Current Line Between Two Columns ─────────────────────────

  static async deleteCurrentLineBetweenTwoColumn(start: number, end: number) {
    const startPosition = new vscode.Position(this.currentLine, start);
    const endPosition   = new vscode.Position(this.currentLine, end);
    const deletionRange = new vscode.Range(startPosition, endPosition);

    await this.#editor.edit(edit => edit.delete(deletionRange));
  }

  // ─── Set Selections ──────────────────────────────────────────────────

  static setSelections(selections: vscode.Selection[]) {
    this.#editor.selections = selections;
  }
}
