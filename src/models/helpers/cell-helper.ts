import type { PlayerType } from "@/types";
import type { Cell, CellGrid } from "../models/cell";
import type { Location } from "../models/location";
import { PieceHelper } from "./piece-helper";

export class CellHelper {
    /**
     * Returns true if the cell has a piece, otherwise false.
     * 
     * @param cell - the cell to check
     */
    static hasPiece(cell: Cell): boolean {
        return !!cell.piece;
    }

    /**
     * Return the cell at the specified location in the cell grid.
     * 
     * @param cellGrid - the grid of cells
     * @param location - the location of the cell to retrieve
     */
    static getCellAt(cellGrid: CellGrid, location: Location): Cell | null {
        return cellGrid[location.rowIndex]?.[location.colIndex] || null;
    }

    /**
     * Retrieve all cells that contain a piece belonging to the specified player.
     * 
     * @param cellGrid - the grid of cells
     * @param playerType - the player type ('red' or 'blue') to filter pieces by
     */
    static getPlayerCells(cellGrid: CellGrid, playerType: PlayerType): Cell[] {
        return cellGrid.flat().filter(
            (cell) => CellHelper.hasPiece(cell) && cell.piece?.playerType === playerType
        );
    }

    static prettyPrintCellGrid(cellGrid: CellGrid): void {
        console.table(
            map2dWithTransform(cellGrid, (cell) => {
                return PieceHelper.getPieceName(cell.piece?.type)
            })
        )
    }
}

// TODO: move this somewhere else
export const map2dWithTransform = <Thing>(whatever: Thing[][], tranformer: (thing: Thing) => unknown) => {
    return whatever.map((row) => {
        return row.map((thing) => {
            return tranformer(thing);
        })
    })
}