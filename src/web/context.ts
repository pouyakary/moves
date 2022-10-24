import * as vscode        from 'vscode';

export class SpaceComputationContext {

    // ─── Editor ──────────────────────────────────────────────────

    get editor() {
      return vscode.window.activeTextEditor!;
    }

    // ─── Current Line ────────────────────────────────────────────

    get currentLine(): number {
        return this.editor.selection.active.line;
    }

    get currentColumn(): number {
        return this.editor.selection.active.character;
    }

    // ─── Tab Size ────────────────────────────────────────────────

    get tabSize(): number {
      const editorTabSetting  = this.editor.options.tabSize;
      const currentTabSize    = typeof editorTabSetting === 'number'
                                  ? editorTabSetting : 2;
      return currentTabSize;
    }

    // ─── Get Line At ─────────────────────────────────────────────

    lineAt(line: number): string {
      return this.editor.document.lineAt(line).text;
    }

    // ─── Current Line ────────────────────────────────────────────

    get currentLineContent(): string {
      return this.lineAt(this.currentLine);
    }

    // ─── Checks To See If A Line Is Not Empty ────────────────────

    lineIsNotEmptyAt(line: number): boolean {
      return /^\s*$/.test(this.lineAt(line)) === false;
    }

    // ─── Get The Upper Line ──────────────────────────────────────

    get contentOfTheFirstFilledLineAbove(): string {
      if (this.currentLine === 0) {
        return '';
      }
      for (let index = this.currentLine - 1; index >= 0; index--) {
        if (this.lineIsNotEmptyAt(index)) {
          return this.lineAt(index);
        }
      }
      return '';
    }

    // ─── Get Columns ─────────────────────────────────────────────

    get columns(): number[] {
      const line     = this.contentOfTheFirstFilledLineAbove;
      const tabSize  = this.tabSize;
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

    // ─── Delta To Nearest Column ─────────────────────────────────

    get deltaToNextColumn(): number {
      const { currentColumn } = this;
      for (const column of this.columns) {
        if (column > currentColumn) {
          return column - currentColumn;
        }
      }
      return 0;
    }

    // ─── Spaces Needed After The Current Position ────────────────

    get additionalSpaces(): string {
      return ' '.repeat(this.deltaToNextColumn);
    }

    // ─── New Line ────────────────────────────────────────────────

    get newLineContent(): string {
      return this.currentLineContent + this.additionalSpaces;
    }
}