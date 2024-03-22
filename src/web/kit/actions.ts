import * as vscode from "vscode";
import * as kit from ".";

// ─── Editor ──────────────────────────────────────────────────────────

function getEditor() {
  return vscode.window.activeTextEditor!;
}

// ─── Display Message ─────────────────────────────────────────────────

export function alert(message: string) {
  vscode.window.showInformationMessage(message);
}

// ─── Insert At ───────────────────────────────────────────────────────

export async function insertAt(position: vscode.Position, text: string) {
  await getEditor().edit((edit) => {
    edit.insert(position, text);
  });
}

// ─── Delete Current Line Between Two Columns ─────────────────────────

export async function deleteCurrentLineBetweenTwoColumn(
  start: number,
  end: number,
) {
  const startPosition = new vscode.Position(
    kit.document.getCurrentLine(),
    start,
  );
  const endPosition = new vscode.Position(kit.document.getCurrentLine(), end);
  const deletionRange = new vscode.Range(startPosition, endPosition);
  const editor = getEditor();

  await editor.edit((edit) => edit.delete(deletionRange));
}

// ─── Set Selections ──────────────────────────────────────────────────

export function setSelections(selections: vscode.Selection[]) {
  getEditor().selections = selections;
}
