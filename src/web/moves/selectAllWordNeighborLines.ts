import * as kit from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function selectAllWordNeighborLines() {
  kit.Columns.putCursorsInLinesRangeWithCurrentColumn(
    ...kit.Columns.wordNeighborLinesRange,
  );
}
