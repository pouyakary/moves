import { Editor } from '../kit';
import * as vscode from 'vscode';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function addCursorToAllLinesOfSameColumn() {
  const [startLine, endLine] = Editor.linesWithTheSameColumnAndWord;
  Editor.selectColumnsInRangeOfLines(startLine, endLine);
}
