import * as kit from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function addCursorToAllNeighborLines() {
  const range = kit.Columns.neighborLinesOfCurrentRenderColumn;
  if (range === null) {
    return;
  }
  kit.Columns.putCursorsInLinesRangeWithCurrentColumn(...range);
}
