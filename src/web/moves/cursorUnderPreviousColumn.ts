import { Editor } from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function cursorUnderPreviousColumn() {
  const currentColumn     = Editor.currentColumn;
  const previousColumns   = Editor.previousColumn;

  const isTextWhitespace  = isSpaceBetweenTwoColumnsErasable(
    previousColumns, currentColumn,
  );

  if (isTextWhitespace) {
    await Editor.deleteCurrentLineBetweenTwoColumn(
      previousColumns, currentColumn
    );
  }
}

// ─── Is The Space Between The Two Columns White Space ──────────────────── ✣ ─

function isSpaceBetweenTwoColumnsErasable(current: number, previous: number) {
  const textBetweenTwoColumns = Editor.currentLineContent.substring(
    previous, current,
  );
  return /^\s*$/.test(textBetweenTwoColumns);
}

