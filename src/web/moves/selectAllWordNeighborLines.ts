import { EditorKit } from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function selectAllWordNeighborLines() {
  const [startLine, endLine] = EditorKit.wordNeighborLinesRange;
  EditorKit.putCursorsInLinesRangeWithCurrentColumn(startLine, endLine);
}
