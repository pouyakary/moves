import { Editor } from '../kit';

// ─── Executer ──────────────────────────────────────────────────────────── ✣ ─

export async function selectAllWordNeighborLines() {
  const [startLine, endLine] = Editor.wordNeighborLinesRange;
  Editor.putCursorsInLinesRangeWithCurrentColumn(startLine, endLine);
}
