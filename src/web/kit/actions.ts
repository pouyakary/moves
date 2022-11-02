import * as vscode from 'vscode';
import * as kit    from '.';

export class Actions {

  // ─── Editor ──────────────────────────────────────────────────────────

  static get #editor() {
    return vscode.window.activeTextEditor!;
  }

  // ─── Display Message ─────────────────────────────────────────────────

  static alert(message: string) {
    vscode.window.showInformationMessage(message);
  }

  // ─── Insert At ───────────────────────────────────────────────────────

  static async insertAt(position: vscode.Position, text: string) {
    await this.#editor.edit(edit => {
      edit.insert(position, text);
    });
  }

  // ─── Delete Current Line Between Two Columns ─────────────────────────

  static async deleteCurrentLineBetweenTwoColumn(start: number, end: number) {
    const startPosition = new vscode.Position(kit.Document.currentLine, start);
    const endPosition   = new vscode.Position(kit.Document.currentLine, end);
    const deletionRange = new vscode.Range(startPosition, endPosition);

    await this.#editor.edit(edit => edit.delete(deletionRange));
  }

  // ─── Set Selections ──────────────────────────────────────────────────

  static setSelections(selections: vscode.Selection[]) {
    this.#editor.selections = selections;
  }
}
