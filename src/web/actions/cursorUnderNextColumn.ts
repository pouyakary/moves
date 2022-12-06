import * as kit from '../kit';

// ─── Move To The Next Column ───────────────────────────────────────────── ✣ ─

export async function cursorUnderNextColumnAbove() {
  await moveToNextColumn(kit.columns.geNextRenderColumnAbove());
}

export async function cursorUnderNextColumnBelow() {
  await moveToNextColumn(kit.columns.getNextRenderColumnBelow());
}

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

async function moveToNextColumn(nextColumn: number) {
  const currentColumn     = kit.columns.getCurrentPhysicalColumn();
  const delta             = nextColumn - currentColumn;
  const additionalSpaces  = ' '.repeat(delta);

  await kit.Actions.insertAt(
    kit.columns.getPhysicalCursorPosition(),
    additionalSpaces,
  );
}