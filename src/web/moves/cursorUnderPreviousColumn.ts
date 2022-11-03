import * as kit from '../kit';

// ─── Move To The Previous Column ───────────────────────────────────────── ✣ ─

export async function cursorUnderPreviousColumnAbove() {
  await moveCursorUnderPreviousColumn(kit.Columns.previousRenderColumnAbove);
}

export async function cursorUnderPreviousColumnBelow() {
  await moveCursorUnderPreviousColumn(kit.Columns.previousRenderColumnBelow);
}

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

async function moveCursorUnderPreviousColumn(previousColumns: number) {
  const currentColumn     = kit.Columns.currentPhysicalColumn;
  const isTextWhitespace  = isSpaceBetweenTwoColumnsErasable(
    previousColumns, currentColumn,
  );

  if (isTextWhitespace) {
    await kit.Actions.deleteCurrentLineBetweenTwoColumn(
      previousColumns, currentColumn
    );
  }
}

// ─── Is The Space Between The Two Columns White Space ──────────────────── ✣ ─

function isSpaceBetweenTwoColumnsErasable(current: number, previous: number) {
  const textBetweenTwoColumns = kit.Document.currentLineContent.substring(
    previous, current,
  );
  return /^\s*$/.test(textBetweenTwoColumns);
}

