import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import type { Location } from "../models/location";
import type { Cell } from "../models/cell";
import type { Movement } from "../models/movement";
import { CellHelper } from "./cell-helper";
import { LocationHelper } from "./location-helper";
import type { OrientationDegrees } from "@/types";

export class MovementHelper {
    static checkMove(sourceCell: Cell, targetCell: Cell): Movement {
        if (!CellHelper.hasPiece(sourceCell) || sourceCell.piece.type === 'l') {
            // Source cell cannot be moved
            console.error('a - source cell has no piece or is a laser piece')
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location };
        }

        // Ensure source and target cells are different - actually moving to somewhere else
        if (LocationHelper.equals(sourceCell.location, targetCell.location)) {
            console.error('b - same location', { sourceCell, targetCell })
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location };
        }

        // Ensure that the cells are neighbors
        if (!this.areCellsNeighbors(sourceCell.location, targetCell.location)) {
            console.error('c - not neighbors')
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location };
        }

        // Ensure other player's piece isn't being moved to a reserved cell
        if (sourceCell.piece.playerType !== 'blue' && targetCell.type === 'reserved-blue') {
            console.error('d - reserved for blue')
            // Cannot move a piece that's not blue player's (e.g. red player's piece) to a cell reserved for blue player's pieces
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location }
        }

        if (sourceCell.piece.playerType !== 'red' && targetCell.type === 'reserved-red') {
            console.error('e - reserved for red')
            // Cannot move a piece that's not red player's (e.g. blue player's piece) to a cell reserved for red player's pieces
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location }
        }

        if (sourceCell.piece.type === 's' && (targetCell.piece?.type === 'd' || targetCell.piece?.type === 'b')) {
            console.error('f - switching not allowed')
            // A 'Switch' piece can be swapped with any player's target cell of type: 'Defender' or 'Deflector'
            return { type: 'special', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location }

        } else if (CellHelper.hasPiece(targetCell)) {
            console.error('g - has a piece', { sourceCell, targetCell })
            // Target cell already has a piece, and the source cell isn't a 'Switch' piece
            // - Invalid move
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location }
        }

        // Target cell is neighbouring and is empty
        console.info('h')
        return { type: 'normal', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location }
    }

    /**
    * Returns whether the source and target cells are neighbors (any of the sides are touching, vertically, horizontally or diagonally)
    * 
    * @param sourceCell 
    * @param targetCell 
    */
    static areCellsNeighbors(sourceCellLocation: Location, targetCellLocation: Location): boolean {
        /**
         * A polygon defining the maximum range the source cell can move into.
         * - Basically a square offset by 1 col/row index outwards.
         * 
         * -----------
         * |a| | | |d|
         * | | |x| | |
         * |b| | | |c|
         * -----------
         * 
         * Where:
         *   |x| is our sourceCellLocation.
         *   and 'a', 'b', 'c' and 'd' denote where the target cell location can move to, but cannot go past
         *      |a| is the extreme top-left – (x.col - 1) and (x.row - 1)
         *      |b| is the extreme bottom-left (x.col - 1) and (x.row + 1)
         *      |c| is the extreme bottom-right (x.col + 1) and (x.row + 1)
         *      |d| is the extreme top-right (x.col + 1) and (x.row - 1)
         * 
         * @see https://github.com/kishannareshpal/laserchess/blob/master/docs/Guide.md#How-to-play-steps
         */
        const maximumRangePolygon = polygon([[
            [sourceCellLocation.colIndex - 1, sourceCellLocation.rowIndex - 1], // |a|
            [sourceCellLocation.colIndex - 1, sourceCellLocation.rowIndex + 1], // |b|
            [sourceCellLocation.colIndex + 1, sourceCellLocation.rowIndex + 1], // |c|
            [sourceCellLocation.colIndex + 1, sourceCellLocation.rowIndex - 1], // |d|
            [sourceCellLocation.colIndex - 1, sourceCellLocation.rowIndex - 1] // we need a closing point for the polyon, that is, back to point |a|
        ]]);

        // Check if the target cell point is within the maximum range polygon
        const targetCellPoint = point([targetCellLocation.colIndex, targetCellLocation.rowIndex]);
        return booleanPointInPolygon(targetCellPoint, maximumRangePolygon);
    }

    /**
     * Rotates an orientation by 90 degrees in the specified direction.
     *
     * @param orientation - The current orientation in degrees. Must be one of `0`, `90`, `180`, or `270`.
     *
     * @param direction - The rotation direction.
     * - `'clockwise'` rotates the orientation by +90°.
     * - `'anticlockwise'` rotates the orientation by -90°.
     *
     * @returns The new orientation in degrees (`0 | 90 | 180 | 270`).
     *
     * @example
     * ```ts
     * OrientationHelper.rotateOrientation(0, 'clockwise');       // 90
     * OrientationHelper.rotateOrientation(270, 'clockwise');    // 0
     * OrientationHelper.rotateOrientation(0, 'anticlockwise');  // 270
     * OrientationHelper.rotateOrientation(180, 'anticlockwise'); // 90
     * ```
     */
    static getNetOrientation(orientation: OrientationDegrees, direction: 'clockwise' | 'anticlockwise'): OrientationDegrees {
        // The amount to rotate by. This game only supports 90deg rotations
        const step = direction === 'clockwise' ? 90 : -90;

        // Normalizes orientation to [0, 360), mapping 360deg back to 0deg since both represent the same orientation.
        const next = (orientation + step + 360) % 360;

        // Explicit cast to ensure we only ever return 0, 90, 180, or 270
        return next as OrientationDegrees;
    }
}