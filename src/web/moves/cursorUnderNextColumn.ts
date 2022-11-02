import * as kit from '../kit';

// ─── Move To The Next Column ───────────────────────────────────────────── ✣ ─

export async function cursorUnderNextColumnAbove() {
  await moveToNextColumn(kit.Columns.nextRenderColumnAbove);
}

export async function cursorUnderNextColumnBelow() {
  await moveToNextColumn(kit.Columns.nextRenderColumnBelow);
}

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

async function moveToNextColumn(nextColumn: number) {
  const currentColumn     = kit.Columns.currentPhysicalColumn;
  const delta             = nextColumn - currentColumn;
  const additionalSpaces  = ' '.repeat(delta);

  await kit.Actions.insertAt(
    kit.Columns.physicalCursorPosition,
    additionalSpaces,
  );
}