import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import type { Location } from "@/models/location";
import type { Cell, CellGrid } from "@/models/cell";
import type { Movement } from "@/models/movement";
import { CellHelper } from "./cell-helper";
import { LocationHelper } from "./location-helper";
import type { OrientationDegrees } from "@/types";
import { produce } from 'immer';

export class MovementHelper {
    static toAN(movement: Movement): string {
        const sourceCellLocationAN = LocationHelper.toAN(movement.sourceCellLocation);
        const targetCellLocationAN = LocationHelper.toAN(movement.targetCellLocation);

        return `${sourceCellLocationAN}${targetCellLocationAN}`;
    }

    static perform(movement: Movement, cellGrid: CellGrid): CellGrid {
        if (movement.type === 'invalid') {
            return;
        }

        const sourceCell = structuredClone(cellGrid[movement.sourceCellLocation.rowIndex][movement.sourceCellLocation.colIndex]);
        const targetCell = structuredClone(cellGrid[movement.targetCellLocation.rowIndex][movement.targetCellLocation.colIndex]);

        return produce(cellGrid, (draftCellGrid) => {
            if (movement.type === 'normal' || movement.type === 'special') {
                // Swap source and target pieces (on a normal move, the target piece is empty/null, so the source will become empty/null)
                Object.assign(
                    draftCellGrid[movement.sourceCellLocation.rowIndex][movement.sourceCellLocation.colIndex],
                    {
                        id: targetCell.id,
                        piece: targetCell.piece,
                        location: movement.sourceCellLocation
                    }
                );

                Object.assign(
                    draftCellGrid[movement.targetCellLocation.rowIndex][movement.targetCellLocation.colIndex],
                    {
                        id: sourceCell.id,
                        piece: sourceCell.piece,
                        location: movement.targetCellLocation
                    }
                )

            } else if (movement.type === 'clockwise_rotation' || movement.type === 'anticlockwise_rotation') {
                // Rotate the target piece clockwise or anti-clockwise (which should always be assumed to be the same as source piece in this case, but we use the target piece for correctness)
                const targetPiece = draftCellGrid[movement.targetCellLocation.rowIndex][movement.targetCellLocation.colIndex].piece;
                if (!targetPiece) {
                    return;
                }

                const nextOrientation = MovementHelper.getNextOrientation(
                    targetPiece.orientation,
                    movement.type === 'clockwise_rotation' ? 'clockwise' : 'anticlockwise'
                )
                draftCellGrid[movement.targetCellLocation.rowIndex][movement.targetCellLocation.colIndex].piece.orientation = nextOrientation;
            }
        })

        // CellHelper.prettyPrintCellGrid(cellGrid)
    }

    /**
     * Get all moves for a particular piece at the specified location
     * 
     * @param location the location on which the piece to get the moves is.
     * @returns a list of all possible movements for a piece at the given location
     */
    static getMovesForPieceAt(location: Location, cellGrid: CellGrid): Movement[] {
        const possibleMovements = [];

        const sourceCol = location.colIndex;
        const sourceRow = location.rowIndex;

        /**
         * Defines possible move targets for a piece.
         * - Every piece, except for Laser, have up to 10 possible moves (these are, moving to one of the neighbor cells (sides or diagonally) or rotating clockwise/anti-clockwise): 
         * - The Laser pieces are immovable throughout the entire game.
         * 
         * ```
         * -------------
         * |TL| |T| |TR|
         * |L|  |x|  |R|
         * |BL| |B| |BR|
         * -------------
         * 
         * Where:
         *   |x| represents our piece's initial location
         *   |L| represents a possible move to the left of our piece
         *   |R| represents a possible move to the right of our piece
         *   |T| represents a possible move above our piece
         *   |B| represents a possible move below our piece
         *   |TL| represents a possible move to the top-left of our piece
         *   |TR| represents a possible move to the top-right of our piece
         *   |BL| represents a possible move to the bottom-left of our piece
         *   |BR| represents a possible move to the bottom-right of our piece
         * ```
         * 
         * @remarks
         *  - Moves are only possible according to the documented rules here: https://github.com/kishannareshpal/laserchess/blob/master/docs/AlgebraicNotation.md#movement
         *  - Moves are only possible to an extreme that is within the board's bounds. 
         *    For example, if the |x| is at the right-most edge of our board, then moves to |TR|, |R| and |BR| are guaranteed to never be possible.
         */
        const TARGET_LOCATION_INDEX_RANGES = [
            [sourceCol - 1, sourceRow - 1], // TL
            [sourceCol + 0, sourceRow - 1], // T
            [sourceCol + 1, sourceRow - 1], // TR
            [sourceCol + 1, sourceRow + 0], // R
            [sourceCol + 1, sourceRow + 1], // BR
            [sourceCol + 0, sourceRow + 1], // B
            [sourceCol - 1, sourceRow + 1], // BL
            [sourceCol - 1, sourceRow + 0], // L
        ];

        TARGET_LOCATION_INDEX_RANGES.forEach(([targetColIndex, targetRowIndex]) => {
            const maybeTargetLocation: Location = {
                colIndex: targetColIndex,
                rowIndex: targetRowIndex
            };

            // Ensure the target location is within the board bounds
            if (!LocationHelper.isWithinBounds(maybeTargetLocation)) {
                return; // skip this iteration
            }

            const sourceCell = CellHelper.getCellAt(cellGrid, location);
            const maybeTargetCell = CellHelper.getCellAt(cellGrid, maybeTargetLocation);

            // Ensure the movement possibility
            const movePossibility = this.checkMove(sourceCell, maybeTargetCell);
            if (movePossibility.type === 'invalid') {
                // According to the rules of movements, this move is not possible
                return;
            }

            // Move is possible
            possibleMovements.push(movePossibility);
        });

        // TODO: add rotation possibility as well?
        return possibleMovements;
    }

    static checkMove(sourceCell: Cell, targetCell: Cell): Movement {
        if (!CellHelper.hasPiece(sourceCell) || sourceCell.piece.type === 'l') {
            // Source cell cannot be moved
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location };
        }

        // Ensure source and target cells are different - actually moving to somewhere else
        if (LocationHelper.equals(sourceCell.location, targetCell.location)) {
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location };
        }

        // Ensure that the cells are neighbors
        if (!this.areCellsAdjacent(sourceCell.location, targetCell.location)) {
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location };
        }

        // Ensure other player's piece isn't being moved to a reserved cell
        if (sourceCell.piece.playerType !== 'player-two' && targetCell.type === 'reserved-player-one') {
            // Cannot move a piece that's not blue player's (e.g. red player's piece) to a cell reserved for blue player's pieces
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location }
        }

        if (sourceCell.piece.playerType !== 'player-one' && targetCell.type === 'reserved-player-two') {
            // Cannot move a piece that's not red player's (e.g. blue player's piece) to a cell reserved for red player's pieces
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location }
        }

        if (sourceCell.piece.type === 's' && (targetCell.piece?.type === 'd' || targetCell.piece?.type === 'b')) {
            // A 'Switch' piece can be swapped with any player's target cell of type: 'Defender' or 'Deflector'
            return { type: 'special', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location }

        } else if (CellHelper.hasPiece(targetCell)) {
            // Target cell already has a piece, and the source cell isn't a 'Switch' piece
            // - Invalid move
            return { type: 'invalid', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location }
        }

        // Target cell is neighbouring and is empty
        return { type: 'normal', sourceCellLocation: sourceCell.location, targetCellLocation: targetCell.location }
    }

    /**
    * Returns whether the source and target cells are neighbors (any of the sides are touching, vertically, horizontally or diagonally)
    * 
    * @param sourceCell 
    * @param targetCell 
    */
    static areCellsAdjacent(sourceCellLocation: Location, targetCellLocation: Location): boolean {
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
         *   - |x| is our sourceCellLocation.
         *   - 'a', 'b', 'c' and 'd' denote where the target cell location can move to, but cannot go past
         *      |a| is the top-left extreme – (x.col - 1) and (x.row - 1)
         *      |b| is the bottom-left extreme (x.col - 1) and (x.row + 1)
         *      |c| is the bottom-right extreme (x.col + 1) and (x.row + 1)
         *      |d| is the top-right extreme (x.col + 1) and (x.row - 1)
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
     * MovementHelper.getNextOrientation(0, 'clockwise');       // 90
     * MovementHelper.getNextOrientation(270, 'clockwise');    // 0
     * MovementHelper.getNextOrientation(0, 'anticlockwise');  // 270
     * MovementHelper.getNextOrientation(180, 'anticlockwise'); // 90
     * ```
     */
    static getNextOrientation(orientation: OrientationDegrees, direction: 'clockwise' | 'anticlockwise'): OrientationDegrees {
        // The amount to rotate by. This game only supports 90deg rotations
        const step = direction === 'clockwise' ? 90 : -90;

        // Normalizes orientation to [0, 360), mapping 360deg back to 0deg since both represent the same orientation.
        const next = (orientation + step + 360) % 360;

        // Explicit cast to ensure we only ever return 0, 90, 180, or 270
        return next as OrientationDegrees;
    }
}