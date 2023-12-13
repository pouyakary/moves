import * as kit from '../kit';

// ─── Move To The Previous Column ───────────────────────────────────────── ✣ ─

export
async function
cursorUnderPreviousColumnAbove() {
  await moveCursorUnderPreviousColumn(kit.columns.getPreviousRenderColumnAbove());
}

export
async function
cursorUnderPreviousColumnBelow() {
  await moveCursorUnderPreviousColumn(kit.columns.getPreviousRenderColumnBelow());
}

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

async function
moveCursorUnderPreviousColumn(previousColumns: number) {
  const currentColumn     = kit.columns.getCurrentPhysicalColumn();
  const isTextWhitespace  = isSpaceBetweenTwoColumnsErasable(
    previousColumns, currentColumn,
  );

  if (isTextWhitespace) {
    await kit.actions.deleteCurrentLineBetweenTwoColumn(
      previousColumns, currentColumn
    );
  }
}

// ─── Is The Space Between The Two Columns White Space ──────────────────── ✣ ─

function
isSpaceBetweenTwoColumnsErasable(current: number, previous: number) {
  const textBetweenTwoColumns = kit.document.getCurrentLineContent().substring(
    previous, current,
  );
  return /^\s*$/.test(textBetweenTwoColumns);
}

