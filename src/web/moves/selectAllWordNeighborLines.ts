import * as kit from '../kit';
import * as vscode from 'vscode';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function selectAllWordNeighborLines() {
  const [startLine, endLine] = kit.Columns.wordNeighborLinesRange;
  kit.Columns.putCursorsInLinesRangeWithCurrentColumn(startLine, endLine);
}
