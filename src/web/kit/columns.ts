import * as vscode from 'vscode';
import * as kit    from '.';

// ─── Position ────────────────────────────────────────────────────────

export function getCurrentPhysicalColumn(): number {
  return kit.Document.currentColumn;
}

export function getCurrentRenderColumn(): number {
  return physicalToRender(
    kit.Document.currentLine,
    kit.Document.currentColumn
  );
}

// ─── Current Render Column ───────────────────────────────────────────

export function physicalToRender(lineNumber: number, physicalColumn: number) {
  const content      = kit.Document.contentOfLine(lineNumber);
  const characters   = [...content];
  const tabSize      = kit.Document.tabSize;
  let   renderColumn = 0;

  for (let index = 0; index < physicalColumn; index++) {
    // This is very important. Tabs are stopping at columns of their
    // ratio. Say when you are at column 10, tab size is 4, the nearest
    // divisor of 4 is 12, therefore the tab stops at column 12 not 14.
    if (characters[index] === '\t') {
      const remainder = (renderColumn + 1) % tabSize;
      renderColumn += tabSize - remainder + 1;
    } else {
      renderColumn++;
    }
  }

  return renderColumn;
}

// ─── Convert Render Column To Physical Column In Line ────────────────

export function renderToPhysical(
  line:           number,
  expectedColumn: number,
): number | null {

  const lineContent  = kit.Document.contentOfLine(line);
  const characters   = [...lineContent];
  const tabSize      = kit.Document.tabSize;
  let   renderColumn = 0;

  for (let index = 0; index < characters.length; index++) {
    if (renderColumn === expectedColumn) {
      return index;
    }
    if (characters[index] === '\t') {
      const remainder = (renderColumn + 1) % tabSize;
      renderColumn += tabSize - remainder + 1;
    } else {
      renderColumn++;
    }
  }

  return null;
}

// ─── Compute Column Of The Line ──────────────────────────────────────

export function computeAllRenderColumnStarts(line: string): number[] {
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
      const remainder = (visualColumnCount + 1) % tabSize;
      visualColumnCount += tabSize - remainder + 1;
    } else {
      visualColumnCount++;
    }

    previousCharacterWasSpace = !characterIsNotSpace;
  }

  return results;
}

// ─── Word At ─────────────────────────────────────────────────────────

export function getCharacterAtRenderColumn(
  line:         number,
  renderColumn: number,
): string | null {
  const physicalColumn = renderToPhysical(line, renderColumn);
  if (physicalColumn === null) {
    return null;
  }

  const content = kit.Document.contentOfLine(line);

  return content[physicalColumn];
}

// ─── Current Character ───────────────────────────────────────────────

export function getCurrentCharacter(): string | null {
  return getCharacterAtRenderColumn(
    kit.Document.currentLine,
    getCurrentRenderColumn(),
  );
}


// ─── Cursor Position ─────────────────────────────────────────────────

export function getPhysicalCursorPosition(): vscode.Position {
  return new vscode.Position(kit.Document.currentLine, getCurrentPhysicalColumn());
}

// ─── Columns Above ───────────────────────────────────────────────────

export function getColumnsAbove(): number[] {
  return computeAllRenderColumnStarts(
    kit.Document.contentOfTheFirstFilledLineAbove,
  );
}

// ─── Columns Below ───────────────────────────────────────────────────

export function getColumnsBelow(): number[] {
  return computeAllRenderColumnStarts(
    kit.Document.contentOfTheFirstFilledLineBelow,
  );
}

// ─── Lines With The Same Column ──────────────────────────────────────

export function getNeighborLinesOfCurrentRenderColumn(): [number, number] | null {
  const currentRenderColumn = getCurrentRenderColumn;
  const lineCount           = kit.Document.documentLineCount;
  const currentCharacter    = getCurrentCharacter;

  if (currentCharacter === null) {
    return null;
  }

  let startLine = kit.Document.currentLine;
  let endLine   = kit.Document.currentLine;

  // lines above
  for (let lineNo = kit.Document.currentLine; lineNo >= 0; lineNo--) {
    const columns = computeAllRenderColumnStarts(
      kit.Document.contentOfLine(lineNo),
    );
    if (columns.includes(currentRenderColumn())) {
      const character = getCharacterAtRenderColumn(
        lineNo,
        currentRenderColumn(),
      );
      if (character === currentCharacter()) {
        startLine = lineNo;
      }
    } else {
      break;
    }
  }

  // lines under
  for (let lineNo = kit.Document.currentLine; lineNo < lineCount; lineNo++) {
    const columns = computeAllRenderColumnStarts(
      kit.Document.contentOfLine(lineNo)
    );
    if (columns.includes(currentRenderColumn())) {
      const word = getCharacterAtRenderColumn(lineNo, currentRenderColumn());
      if (word === currentCharacter()) {
        endLine = lineNo;
      }
    } else {
      break;
    }
  }

  return [startLine, endLine];
}

// ─── Next Column Above ───────────────────────────────────────────────

export function geNextRenderColumnAbove(): number {
  for (const column of getColumnsAbove()) {
    if (column > getCurrentPhysicalColumn()) {
      return column;
    }
  }
  return getCurrentPhysicalColumn();
}

// ─── Next Column Below ───────────────────────────────────────────────

export function getNextRenderColumnBelow(): number {
  for (const column of getColumnsBelow()) {
    if (column > getCurrentPhysicalColumn()) {
      return column;
    }
  }
  return getCurrentPhysicalColumn();
}

// ─── Previous Column Above ───────────────────────────────────────────

export function getPreviousRenderColumnAbove(): number {
  for (const column of getColumnsAbove().reverse()) {
    if (column < getCurrentPhysicalColumn()) {
      return column;
    }
  }
  return getCurrentPhysicalColumn();
}

// ─── Previous Column Below ───────────────────────────────────────────

export function getPreviousRenderColumnBelow(): number {
  for (const column of getColumnsBelow().reverse()) {
    if (column < getCurrentPhysicalColumn()) {
      return column;
    }
  }
  return getCurrentPhysicalColumn();
}

// ─── Select Columns In Range ─────────────────────────────────────────

export function putCursorsInLinesRangeWithCurrentColumn(
  startingLine: number,
  endLine:      number,
) {
  const currentRenderColumn = getCurrentRenderColumn;
  const selections          = new Array<vscode.Selection>();

  for (let lineNo = startingLine; lineNo <= endLine; lineNo++) {
    const physicalColumn = renderToPhysical(
      lineNo,
      currentRenderColumn()
    );
    selections.push(
      new vscode.Selection(
        lineNo, physicalColumn!, lineNo, physicalColumn!,
      ),
    );
  }

  kit.Actions.setSelections(selections);
}
