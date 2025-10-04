import type { Location } from "../models/location";
import type { Position } from "../models/position";

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
}