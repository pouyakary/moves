import * as vscode from 'vscode';

export class EditorKit {

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

  static get currentPhysicalColumn(): number {
    return this.#editor.selection.active.character;
  }

  static get currentRenderColumn(): number {
    return this.#physicalColumnToRenderColumn(
      this.currentLine,
      this.currentPhysicalColumn,
    );
  }

  // ─── Current Render Column ───────────────────────────────────────────

  static #physicalColumnToRenderColumn(
    lineNumber:     number,
    physicalColumn: number,
  ) {
    const content      = this.contentOfLine(lineNumber);
    let   renderColumn = 0;

    for (let index = 0; index < physicalColumn; index++) {
      renderColumn += content[index] === '\t' ? this.tabSize : 1;
    }

    return renderColumn;
  }

  // ─── Convert Render Column To Physical Column In Line ────────────────

  static #renderColumnToPhysicalColumn(
    line:         number,
    renderColumn: number,
  ): number | null {

    const lineContent = this.contentOfLine(line);
    const tabSize     = this.tabSize;
    let   counter     = renderColumn;

    for (let index = 0; index < lineContent.length; index++) {
      if (counter === 0) {
        return index;
      }
      if (counter < 0) {
        return null;
      }
      const currentCharacter = lineContent[index];
      counter -= currentCharacter === '\t' ? tabSize : 1;
    }

    return null;
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

  // ─── Word At ─────────────────────────────────────────────────────────

  static getWordAtRenderColumn(
    line:         number,
    renderColumn: number,
  ): string | null {
    const physicalColumn = this.#renderColumnToPhysicalColumn(
      line,
      renderColumn,
    );
    if (physicalColumn === null) {
      return null;
    }

    const content = this.contentOfLine(line);
    let   buffer  = "";

    for (let index = physicalColumn; index < content.length; index++) {
      const currentCharacter = content[index];
      if (currentCharacter === ' ' || currentCharacter === '\t') {
        break;
      }
      buffer += currentCharacter;
    }

    return buffer;
  }

  // ─── Current Word ────────────────────────────────────────────────────

  static get currentWord(): string | null {
    return this.getWordAtRenderColumn(
      this.currentLine,
      this.currentRenderColumn,
    );
  }

  // ─── Current Line ────────────────────────────────────────────────────

  static get currentLineContent(): string {
    return this.contentOfLine(this.currentLine);
  }

  // ─── Cursor Position ─────────────────────────────────────────────────

  static get physicalCursorPosition(): vscode.Position {
    return new vscode.Position(this.currentLine, this.currentPhysicalColumn);
  }

  // ─── Insert At ───────────────────────────────────────────────────────

  static async insertAt(position: vscode.Position, text: string) {
    await this.#editor.edit(edit => {
      edit.insert(position, text);
    });
  }

  // ─── Is Line Not Empty ───────────────────────────────────────────────

  static #lineIsNotEmptyAt(line: number): boolean {
    return /^\s*$/.test(EditorKit.contentOfLine(line)) === false;
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

  // ─── Columns ─────────────────────────────────────────────────────────

  static get columns(): number[] {
    return this.#computeRenderColumns(EditorKit.contentOfTheFirstFilledLineAbove);
  }

  // ─── Lines With The Same Column ──────────────────────────────────────

  static get wordNeighborLinesRange(): [number, number] {
    const currentRenderColumn = this.currentRenderColumn;
    const lineCount           = this.#editor.document.lineCount;
    const currentWord         = this.currentWord;
    let   startLine           = this.currentLine;
    let   endLine             = this.currentLine;

    (`column: ${this.currentRenderColumn}, word: '${currentWord}'`);

    // lines above
    for (let lineNo = this.currentLine; lineNo > 0; lineNo--) {
      const columns = this.#computeRenderColumns(this.contentOfLine(lineNo));
      if (columns.includes(currentRenderColumn)) {
        const word = EditorKit.getWordAtRenderColumn(lineNo, currentRenderColumn);
        if (word === currentWord) {
          startLine = lineNo;
        }
      } else {
        break;
      }
    }

    // lines under
    for (let lineNo = this.currentLine; lineNo < lineCount; lineNo++) {
      const columns = this.#computeRenderColumns(this.contentOfLine(lineNo));
      if (columns.includes(currentRenderColumn)) {
        const word = EditorKit.getWordAtRenderColumn(lineNo, currentRenderColumn);
        if (word === currentWord) {
          endLine = lineNo;
        }
      } else {
        break;
      }
    }

    return [startLine, endLine];
  }

  // ─── Compute Column Of The Line ──────────────────────────────────────

  static #computeRenderColumns(line: string): number[] {
    const tabSize = EditorKit.tabSize;
    const results = new Array<number>();

    let previousCharacterWasSpace = true;
    let visualColumnCount         = 0;

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

  static get nextRenderColumn(): number {
    const { columns, currentPhysicalColumn: currentColumn } = EditorKit;
    for (const column of columns) {
      if (column > currentColumn) {
        return column;
      }
    }
    return currentColumn;
  }

  // ─── Previous Column ─────────────────────────────────────────────────

  static get previousRenderColumn(): number {
    const { columns, currentPhysicalColumn } = EditorKit;
    for (const column of columns.reverse()) {
      if (column < currentPhysicalColumn) {
        return column;
      }
    }
    return currentPhysicalColumn;
  }

  // ─── Delete Current Line Between Two Columns ─────────────────────────

  static async deleteCurrentLineBetweenTwoColumn(start: number, end: number) {
    const startPosition = new vscode.Position(this.currentLine, start);
    const endPosition   = new vscode.Position(this.currentLine, end);
    const deletionRange = new vscode.Range(startPosition, endPosition);
    await this.#editor.edit(edit => edit.delete(deletionRange));
  }

  // ─── Select Columns In Range ─────────────────────────────────────────

  static putCursorsInLinesRangeWithCurrentColumn(
    startingLine: number,
    endLine:      number,
  ) {
    const currentRenderColumn = EditorKit.currentRenderColumn;
    const selections          = new Array<vscode.Selection>();

    for (let lineNumber = startingLine; lineNumber <= endLine; lineNumber++) {
      const physicalColumn = this.#renderColumnToPhysicalColumn(
        lineNumber,
        currentRenderColumn,
      );
      selections.push(
        new vscode.Selection(
          lineNumber, physicalColumn!, lineNumber, physicalColumn!,
        ),
      );
    }

    this.#editor.selections = selections;
  }
}
