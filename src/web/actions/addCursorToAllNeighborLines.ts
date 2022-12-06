import * as kit    from '../kit';
import * as vscode from 'vscode';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function addCursorToAllNeighborLines() {
  const linesRange = kit.columns.getNeighborLinesOfCurrentRenderColumn();
  if (linesRange === null || linesRange[0] === linesRange[1]) {
    showNothingToSelectIndicator();
    return;
  }
  kit.columns.putCursorsInLinesRangeWithCurrentColumn(...linesRange);
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