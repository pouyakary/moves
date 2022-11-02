import * as kit from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function cursorUnderNextColumn() {
  const nextColumn        = kit.Columns.nextRenderColumn;
  const currentColumn     = kit.Columns.currentPhysicalColumn;
  const delta             = nextColumn - currentColumn;
  const additionalSpaces  = ' '.repeat(delta);

  await kit.Actions.insertAt(
    kit.Columns.physicalCursorPosition,
    additionalSpaces,
  );
}
