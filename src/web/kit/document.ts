import * as vscode from 'vscode';

// ─── Editor ──────────────────────────────────────────────────────────

function
getEditor() {
  return vscode.window.activeTextEditor!;
}

// ─── Document Size ───────────────────────────────────────────────────

export
function
getDocumentLineCount(): number {
  return getEditor().document.lineCount;
}

// ─── Position ────────────────────────────────────────────────────────

export
function
getCurrentLine(): number {
  return getEditor().selection.active.line;
}

export
function
getCurrentColumn(): number {
  return getEditor().selection.active.character;
}

// ─── Tab Size ────────────────────────────────────────────────────────

export
function
getTabSize(): number {
  const editorTabSetting = getEditor().options.tabSize;
  const currentTabSize   = typeof editorTabSetting === 'number' ? editorTabSetting
                                                                : 2;
  return currentTabSize;
}

// ─── Get Line At ─────────────────────────────────────────────────────

export
function
contentOfLine(line: number): string {
  return getEditor().document.lineAt(line).text;
}

// ─── Get The Upper Line ──────────────────────────────────────────────

export
function
getContentOfTheFirstFilledLineAbove(): string {
  if (getCurrentLine() === 0) {
    return '';
  }
  for (let index = getCurrentLine() - 1; index >= 0; index--) {
    if (lineIsNotEmptyAt(index)) {
      return contentOfLine(index);
    }
  }
  return '';
}

// ─── Get The Downer Line ─────────────────────────────────────────────

export
function
getContentOfTheFirstFilledLineBelow(): string {
  if (getCurrentLine() === getDocumentLineCount() - 1) {
    return '';
  }

  const lineCount = getDocumentLineCount();
  for (let index = getCurrentLine() + 1; index < lineCount; index++) {
    if (lineIsNotEmptyAt(index)) {
      return contentOfLine(index);
    }
  }
  return '';
}

// ─── Current Line ────────────────────────────────────────────────────

export
function
getCurrentLineContent(): string {
  return contentOfLine(getCurrentLine());
}


// ─── Is Line Not Empty ───────────────────────────────────────────────

function
lineIsNotEmptyAt(line: number): boolean {
  return /^\s*$/.test(contentOfLine(line)) === false;
}

