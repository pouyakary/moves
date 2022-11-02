import * as vscode from 'vscode';
import * as kit    from '.';

export class Columns {

  // ─── Position ────────────────────────────────────────────────────────

  static get currentPhysicalColumn(): number {
    return kit.Document.currentColumn;
  }

  static get currentRenderColumn(): number {
    return this.#physicalToRender(
      kit.Document.currentLine,
      kit.Document.currentColumn
    );
  }

  // ─── Count Tabs Algorithm ────────────────────────────────────────────

  static #computeRenderTextSize(text: string) {
    const characters   = [...text];
    const tabSize      = kit.Document.tabSize;
    let   renderColumn = 0;

    for (let index = 0; index < characters.length; index++) {
      // This is very important. Tabs are stopping at columns of their
      // ratio. Say when you are at column 10, tab size is 4, the nearest
      // divisor of 4 is 12, therefore the tab stops at column 12 not 14.
      if (characters[index] === '\t') {
        const remainder = (renderColumn + 1) / tabSize;
        renderColumn += tabSize - remainder;
      } else {
        renderColumn++;
      }
    }

    return renderColumn;
  }

  // ─── Current Render Column ───────────────────────────────────────────

  static #physicalToRender(lineNumber: number, physicalColumn: number) {
    const content      = kit.Document.contentOfLine(lineNumber);
    const tabSize      = kit.Document.tabSize;
    let   renderColumn = 0;

    for (let index = 0; index < physicalColumn; index++) {
      // This is very important. Tabs are stopping at columns of their
      // ratio. Say when you are at column 10, tab size is 4, the nearest
      // divisor of 4 is 12, therefore the tab stops at column 12 not 14.
      if (content[index] === '\t') {
        const remainder = (renderColumn + 1) / tabSize;
        renderColumn += tabSize - remainder;
      } else {
        renderColumn++;
      }
    }

    return renderColumn;
  }

  // ─── Convert Render Column To Physical Column In Line ────────────────

  static #renderToPhysical(
    line:         number,
    renderColumn: number,
  ): number | null {

    const lineContent = kit.Document.contentOfLine(line);
    const tabSize     = kit.Document.tabSize;
    let   counter     = renderColumn;

    for (let index = 0; index < lineContent.length; index++) {
      if (counter === 0) {
        return index;
      }
      if (lineContent[index] === '\t') {
        const remainder = (counter + 1) / tabSize;
        counter += tabSize - remainder;
      } else {
        counter--;
      }
    }

    return null;
  }

  // ─── Compute Column Of The Line ──────────────────────────────────────

  static #computeAllRenderColumnStarts(line: string): number[] {
    const tabSize = kit.Document.tabSize;
    const results = new Array<number>();

    let previousCharacterWasSpace = true;
    let visualColumnCount         = 0;

    for (const character of [...line]) {
      const characterIsNotSpace = character !== ' ' && character !== '\t';

      if (characterIsNotSpace && previousCharacterWasSpace) {
        results.push(visualColumnCount);
      }

      if (character === '\t') {
        const remainder = (visualColumnCount + 1) / tabSize;
        visualColumnCount += tabSize - remainder;
      } else {
        visualColumnCount++;
      }

      previousCharacterWasSpace = !characterIsNotSpace;
    }

    return results;
  }

  // ─── Word At ─────────────────────────────────────────────────────────

  static getWordAtRenderColumn(
    line:         number,
    renderColumn: number,
  ): string | null {
    const physicalColumn = this.#renderToPhysical(line, renderColumn);
    if (physicalColumn === null) {
      return null;
    }

    const content = kit.Document.contentOfLine(line);
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
      kit.Document.currentLine,
      this.currentRenderColumn,
    );
  }

  // ─── Cursor Position ─────────────────────────────────────────────────

  static get physicalCursorPosition(): vscode.Position {
    return new vscode.Position(kit.Document.currentLine, this.currentPhysicalColumn);
  }


  // ─── Columns Above ───────────────────────────────────────────────────

  static get columnsAbove(): number[] {
    return this.#computeAllRenderColumnStarts(
      kit.Document.contentOfTheFirstFilledLineAbove,
    );
  }

  // ─── Columns Below ───────────────────────────────────────────────────

  static get columnsBelow(): number[] {
    return this.#computeAllRenderColumnStarts(
      kit.Document.contentOfTheFirstFilledLineBelow,
    );
  }

  // ─── Lines With The Same Column ──────────────────────────────────────

  static get wordNeighborLinesRange(): [number, number] {
    const currentRenderColumn = this.currentRenderColumn;
    const lineCount           = kit.Document.documentLineCount;
    const currentWord         = this.currentWord;
    let   startLine           = kit.Document.currentLine;
    let   endLine             = kit.Document.currentLine;

    // lines above
    for (let lineNo = kit.Document.currentLine; lineNo > 0; lineNo--) {
      const columns = this.#computeAllRenderColumnStarts(
        kit.Document.contentOfLine(lineNo),
      );
      if (columns.includes(currentRenderColumn)) {
        const word = this.getWordAtRenderColumn(lineNo, currentRenderColumn);
        if (word === currentWord) {
          startLine = lineNo;
        }
      } else {
        break;
      }
    }

    // lines under
    for (let lineNo = kit.Document.currentLine; lineNo < lineCount; lineNo++) {
      const columns = this.#computeAllRenderColumnStarts(
        kit.Document.contentOfLine(lineNo)
      );
      if (columns.includes(currentRenderColumn)) {
        const word = this.getWordAtRenderColumn(lineNo, currentRenderColumn);
        if (word === currentWord) {
          endLine = lineNo;
        }
      } else {
        break;
      }
    }

    return [startLine, endLine];
  }

  // ─── Next Column Above ───────────────────────────────────────────────

  static get nextRenderColumnAbove(): number {
    const { columnsAbove, currentPhysicalColumn } = this;
    for (const column of columnsAbove) {
      if (column > currentPhysicalColumn) {
        return column;
      }
    }
    return currentPhysicalColumn;
  }

  // ─── Next Column Below ───────────────────────────────────────────────

  static get nextRenderColumnBelow(): number {
    const { columnsBelow, currentPhysicalColumn } = this;
    for (const column of columnsBelow) {
      if (column > currentPhysicalColumn) {
        return column;
      }
    }
    return currentPhysicalColumn;
  }

  // ─── Previous Column Above ───────────────────────────────────────────

  static get previousRenderColumnAbove(): number {
    const { columnsAbove, currentPhysicalColumn } = this;
    for (const column of columnsAbove.reverse()) {
      if (column < currentPhysicalColumn) {
        return column;
      }
    }
    return currentPhysicalColumn;
  }

  // ─── Previous Column Below ───────────────────────────────────────────

  static get previousRenderColumnBelow(): number {
    const { columnsBelow, currentPhysicalColumn } = this;
    for (const column of columnsBelow.reverse()) {
      if (column < currentPhysicalColumn) {
        return column;
      }
    }
    return currentPhysicalColumn;
  }

  // ─── Select Columns In Range ─────────────────────────────────────────

  static putCursorsInLinesRangeWithCurrentColumn(
    startingLine: number,
    endLine:      number,
  ) {
    const currentRenderColumn = this.currentRenderColumn;
    const selections          = new Array<vscode.Selection>();

    for (let lineNo = startingLine; lineNo <= endLine; lineNo++) {
      const physicalColumn = this.#renderToPhysical(
        lineNo,
        currentRenderColumn
      );
      selections.push(
        new vscode.Selection(
          lineNo, physicalColumn!, lineNo, physicalColumn!,
        ),
      );
    }

    kit.Actions.setSelections(selections);
  }
}
