import * as kit    from '../kit';
import * as vscode from 'vscode';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function addCursorToAllNeighborLines() {
  const linesRange = kit.Columns.neighborLinesOfCurrentRenderColumn;
  if (linesRange === null || linesRange[0] === linesRange[1]) {
    showNothingToSelectIndicator();
    return;
  }
  kit.Columns.putCursorsInLinesRangeWithCurrentColumn(...linesRange);
}

// ─── Nothing To Select Indicator ───────────────────────────────────────── ✣ ─

function showNothingToSelectIndicator() {
  const showTime      = 400;
  const statusbarItem = vscode.window.createStatusBarItem();
  statusbarItem.text  = "●";
  statusbarItem.show();

  setTimeout(() => {
    statusbarItem.hide();
    statusbarItem.dispose();
  }, showTime);
}