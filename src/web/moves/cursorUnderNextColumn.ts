import { EditorKit } from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function cursorUnderNextColumn() {
  const delta             = EditorKit.nextRenderColumn - EditorKit.currentPhysicalColumn;
  const additionalSpaces  = ' '.repeat(delta);
  await EditorKit.insertAt(EditorKit.physicalCursorPosition, additionalSpaces);
}
