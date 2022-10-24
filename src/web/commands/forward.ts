import { Editor } from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function moveForwardCommand() {
  const delta             = computeDeltaToTheNextColumn();
  const additionalSpaces  = ' '.repeat(delta);

  await Editor.insertAt(Editor.cursorPosition, additionalSpaces);
}

// ─── Delta To Next Column ──────────────────────────────────────────────── ✣ ─

function computeDeltaToTheNextColumn(): number {
  const { columns, currentColumn } = Editor;

  for (const column of columns) {
    if (column > currentColumn) {
      return column - currentColumn;
    }
  }
  return 0;
}
