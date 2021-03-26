/**
 * @constant
 * Column lookup representation in algebraic notation
 * The first column, from left-to-right, is "a", the next one is "b" and so on, until the last (10th column), which is "j".
 * 
 * @see https://github.com/kishannareshpal/docs/AlgebraicNotation.md Algebraic Notation for this game
 */
const COLS_IN_NOTATION = "abcdefghij";

/**
 * @description
 * A class representing a location in the board.
 */
class Location {
    constructor(colIndex, rowIndex) {
        this.colIndex = colIndex; // 0-indexed column (x) for internal use.
        this.rowIndex = rowIndex; // 0-indexed row (y) for internal use.
        this.col = COLS_IN_NOTATION.charAt(colIndex); // the column in Algebraic Notation
        this.row = 8 - rowIndex; // the row in Algebraic Notation
    }

    /**
     * Serializes the Location object into an Object.
     * @returns {Object} plain object, representing this instance
     */
    serialize() {
        return {
            colIndex: this.colIndex,
            rowIndex: this.rowIndex,
            col: this.col,
            row: this.row
        };
    }
}

class LocationUtils {
    /**
    * Parse an AN location text into a Location object.
    * 
    * @param {string} notation the location notation to convert [col][row].
    * @returns {Location} the location object parsed from the AN.
    */
    static parse(notation) {
        const col = notation[0];
        const row = parseInt(notation[1]);
        const colIndex = COLS_IN_NOTATION.indexOf(col);
        const rowIndex = 8 - row;

        return new Location(colIndex, rowIndex);
    }

    /**
     * Transforms the location object into AN.
     * 
     * @param {Location} location the location to be transformed
     * @returns the location in AN format. E.g: location -> a8, location -> b3
     */
    static toANString(location) {
        return `${location.col}${location.row}`;
    }
}

export default Location;
export { LocationUtils };