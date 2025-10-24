import { COLUMN_COUNT, ROW_COUNT } from "@/constants";
import type { Size } from "@/models/size";

export class BoardUIHelper {
    static calculateOptimalLayout(containerSize: Size): { cellLength: number, boardWidth: number, boardHeight: number } {
        const minContainerLength = Math.floor(Math.min(containerSize.width, containerSize.height));
        const cellLength = Math.floor(minContainerLength / Math.max(COLUMN_COUNT, ROW_COUNT));
        const boardWidth = cellLength * COLUMN_COUNT;
        const boardHeight = cellLength * ROW_COUNT;

        return {
            cellLength: cellLength,
            boardWidth: boardWidth,
            boardHeight: boardHeight
        }
    }
}