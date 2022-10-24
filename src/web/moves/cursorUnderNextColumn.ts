import { Editor } from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function cursorUnderNextColumn() {
  const delta             = Editor.nextColumn - Editor.currentColumn;
  const additionalSpaces  = ' '.repeat(delta);
  await Editor.insertAt(Editor.cursorPosition, additionalSpaces);
}
