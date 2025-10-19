import { COLUMN_COUNT, ROW_COUNT } from "@/constants";
import type { LaserDirection } from "@/models/laser";
import type { Location } from "@/models/location";
import type { Position } from "@/models/position";

/**
 * @constant
 * Column lookup representation in algebraic notation
 * The first column, from left-to-right, is "a", the next one is "b" and so on, until the last (10th column), which is "j".
 * 
 * @see https://github.com/kishannareshpal/docs/AlgebraicNotation.md Algebraic Notation for this game
 */
const COLS_IN_NOTATION = "abcdefghij";

export class LocationHelper {
    static toAN(location: Location): string {
        const notationCol = COLS_IN_NOTATION.charAt(location.colIndex);
        const notationRow = 8 - location.rowIndex;

        return `${notationCol}${notationRow}`
    }

    static fromAN(notation: string): Location {
        const notationCol = notation[0];
        const notationRow = parseInt(notation[1]);

        const colIndex = COLS_IN_NOTATION.indexOf(notationCol);
        const rowIndex = 8 - notationRow;

        return { colIndex, rowIndex }
    }

    static fromPosition(position: Position, cellLength: number): Location {
        const colIndex = Math.floor(position.x / cellLength);
        const rowIndex = Math.floor(position.y / cellLength);

        return { colIndex, rowIndex }
    }

    static equals(locationA: Location, locationB: Location): boolean {
        return (locationA.colIndex === locationB.colIndex)
            && (locationA.rowIndex === locationB.rowIndex)
    }

    /**
     * Returns whether {@link location} is within the board bounds.
     * 
     * @param location - The location to look up.
     */
    static isWithinBounds(location: Location): boolean {
        // Make sure that dx and dy are within the bounds of the board
        const isColumnWithinBounds = (location.colIndex >= 0) && (location.colIndex < COLUMN_COUNT);
        const isRowWithinBounds = (location.rowIndex >= 0) && (location.rowIndex < ROW_COUNT);

        return isColumnWithinBounds && isRowWithinBounds;
    }

    /**
     * Find the cell location at the direction of {@link currentLocation} if there is one. 
     * - Otherwise returns `null` if there's no cell at that direction
     * 
     * @param currentLocation - The current location
     * @param direction - The direction to look at
     */
    static findAdjacentLocation(currentLocation: Location, direction: LaserDirection): Location | null {
        let dx: number, dy: number;
        switch (direction) {
            case 'top':
                dx = 0;
                dy = -1;
                break;

            case 'right':
                dx = 1;
                dy = 0
                break;

            case 'bottom':
                dx = 0;
                dy = 1
                break;

            case 'left':
                dx = -1;
                dy = 0
                break;

            default:
                return null;
        }

        const adjacentLocation: Location = {
            colIndex: currentLocation.colIndex + dx,
            rowIndex: currentLocation.rowIndex + dy
        }

        if (!this.isWithinBounds(adjacentLocation)) {
            return null;
        }

        return adjacentLocation;
    }
}