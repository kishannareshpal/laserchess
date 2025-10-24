import type { GridLayerRef } from "@/types";
import type { Cell } from "@/models/cell";

export class GridLayerHelper {
    static findCellNodeById(cellId: Cell['id'], gridLayerRef: GridLayerRef) {
        return gridLayerRef.current.findOne(`#cp-${cellId}`);
    }
}