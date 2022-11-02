import { EditorKit } from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function cursorUnderPreviousColumn() {
  const currentColumn     = EditorKit.currentPhysicalColumn;
  const previousColumns   = EditorKit.previousRenderColumn;
  const isTextWhitespace  = isSpaceBetweenTwoColumnsErasable(
    previousColumns, currentColumn,
  );

  if (isTextWhitespace) {
    await EditorKit.deleteCurrentLineBetweenTwoColumn(
      previousColumns, currentColumn
    );
  }
}

// ─── Is The Space Between The Two Columns White Space ──────────────────── ✣ ─

function isSpaceBetweenTwoColumnsErasable(current: number, previous: number) {
  const textBetweenTwoColumns = EditorKit.currentLineContent.substring(
    previous, current,
  );
  return /^\s*$/.test(textBetweenTwoColumns);
}

