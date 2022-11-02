import * as kit from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function cursorUnderPreviousColumn() {
  const currentColumn     = kit.Columns.currentPhysicalColumn;
  const previousColumns   = kit.Columns.previousRenderColumn;
  const isTextWhitespace  = isSpaceBetweenTwoColumnsErasable(
    previousColumns, currentColumn,
  );

  if (isTextWhitespace) {
    await kit.Editor.deleteCurrentLineBetweenTwoColumn(
      previousColumns, currentColumn
    );
  }
}

// ─── Is The Space Between The Two Columns White Space ──────────────────── ✣ ─

function isSpaceBetweenTwoColumnsErasable(current: number, previous: number) {
  const textBetweenTwoColumns = kit.Editor.currentLineContent.substring(
    previous, current,
  );
  return /^\s*$/.test(textBetweenTwoColumns);
}

