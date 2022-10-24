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

  // ─── Position ────────────────────────────────────────────────────────

  static get currentLine(): number {
      return this.#editor.selection.active.line;
  }

  static get currentColumn(): number {
      return this.#editor.selection.active.character;
  }

  // ─── Tab Size ────────────────────────────────────────────────────────

  static get tabSize(): number {
    const editorTabSetting  = this.#editor.options.tabSize;
    const currentTabSize    = typeof editorTabSetting === 'number'
                                ? editorTabSetting : 2;
    return currentTabSize;
  }

  // ─── Get Line At ─────────────────────────────────────────────────────

  static lineAt(line: number): string {
    return this.#editor.document.lineAt(line).text;
  }

  // ─── Current Line ────────────────────────────────────────────────────

  static get currentLineContent(): string {
    return this.lineAt(this.currentLine);
  }

  // ─── Cursor Position ─────────────────────────────────────────────────

  static get cursorPosition(): vscode.Position {
    return new vscode.Position(this.currentLine, this.currentColumn);
  }

  // ─── Insert At ───────────────────────────────────────────────────────

  static async insertAt(position: vscode.Position, text: string) {
    await this.#editor.edit(edit => {
      edit.replace(position, text);
    });
    await vscode.commands.executeCommand('cancelSelection');
  }

  // ─── Is Line Not Empty ───────────────────────────────────────────────

  static #lineIsNotEmptyAt(line: number): boolean {
    return /^\s*$/.test(Editor.lineAt(line)) === false;
  }

  // ─── Get The Upper Line ──────────────────────────────────────────────

  static get contentOfTheFirstFilledLineAbove(): string {
    if (this.currentLine === 0) {
      return '';
    }
    for (let index = this.currentLine - 1; index >= 0; index--) {
      if (this.#lineIsNotEmptyAt(index)) {
        return this.lineAt(index);
      }
    }
    return '';
  }

  // ─── Columns ─────────────────────────────────────────────────────────

  static get columns(): number[] {
    const line     = Editor.contentOfTheFirstFilledLineAbove;
    const tabSize  = Editor.tabSize;
    const results  = new Array<number>();

    let visualColumnCount         = 0;
    let previousCharacterWasSpace = true;

    for (const character of [...line]) {
      const characterIsNotSpace = character !== ' ' && character !== '\t';

      if (characterIsNotSpace && previousCharacterWasSpace) {
        results.push(visualColumnCount);
      }

      visualColumnCount += character === '\t' ? tabSize : 1;
      previousCharacterWasSpace = !characterIsNotSpace;
    }

    return results;
  }

  // ─── Next Column ─────────────────────────────────────────────────────

  static get nextColumn(): number {
    const { columns, currentColumn } = Editor;
    for (const column of columns) {
      if (column > currentColumn) {
        return column;
      }
    }
    return currentColumn;
  }

  // ─── Previous Column ─────────────────────────────────────────────────

  static get previousColumn(): number {
    const { columns, currentColumn } = Editor;

    for (const column of columns.reverse()) {
      if (column < currentColumn) {
        return column;
      }
    }
    return currentColumn;
  }

  // ─── Delete Current Line Between Two Columns ─────────────────────────

  static async deleteCurrentLineBetweenTwoColumn(start: number, end: number) {
    const startPosition   = new vscode.Position(this.currentLine, start);
    const endPosition     = new vscode.Position(this.currentLine, end);
    const deletionRange   = new vscode.Range(startPosition, endPosition);

    await this.#editor.edit(edit => edit.delete(deletionRange));
    await vscode.commands.executeCommand('cancelSelection');
  }
}