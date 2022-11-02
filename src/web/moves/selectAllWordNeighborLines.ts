import * as kit from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function selectAllWordNeighborLines() {
  const [startLine, endLine] = kit.Columns.wordNeighborLinesRange;
  kit.Columns.putCursorsInLinesRangeWithCurrentColumn(startLine, endLine);
}
