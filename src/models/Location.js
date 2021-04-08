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
    * Parse an AN location text into a Location object.
    * 
    * @param {string} notation the location notation to convert [col][row].
    * @returns {Location} the location object parsed from the AN.
    */
    static fromAN(notation) {
        const col = notation[0];
        const row = parseInt(notation[1]);
        const colIndex = COLS_IN_NOTATION.indexOf(col);
        const rowIndex = 8 - row;
        return new Location(colIndex, rowIndex);
    }


    /**
     * Returns a new Location Object based on the XY coordinates from the board grid.
     * 
     * @param {*} x the X coordinate
     * @param {*} y the Y coordinate
     * @param {*} gridCellSize the size of a single cell in the grid.
     * @returns {number}
     */
    static fromXY(x, y, gridCellSize) {
        const colIndex = Math.floor(x / gridCellSize);
        const rowIndex = Math.floor(y / gridCellSize);
        return new Location(colIndex, rowIndex);
    }


    /**
     * Returns the absolute X position of the piece that can be used to place in the board grid.
     * 
     * @param {number} colIndex 0-based colIndex of the board square.
     * @param {number} gridCellSize The size of the cell in the board grid
     * @param {boolean} centered [default=true] if true, the X position returned will be centered in the cell, if false, it will be at the top left corner of the
     * @returns {number}
     */
    static getX(colIndex, gridCellSize, centered = true) {
        const x = (colIndex * gridCellSize);
        if (centered) {
            return x + (gridCellSize / 2);
        }
        return x;
    }

    /**
     * Returns the absolute Y position of the piece that can be used to place in the board grid.
     * 
     * @param {number} rowIndex 0-based rowIndex of the board square.
     * @param {number} gridCellSize The size of the cell in the board grids
     * @param {boolean} centered [default=true] if true, the X position returned will be centered in the cell, if false, it will be at the top left corner of the cell.
     * @returns {number}
     */
    static getY(rowIndex, gridCellSize, centered = true) {
        const y = (rowIndex * gridCellSize);
        if (centered) {
            return y + (gridCellSize / 2);
        }
        return y;
    }


    /**
     * Transforms the location object into Algebraic Notation string.
     * 
     * @returns {string} the location in AN format. E.g: location -> a8, location -> b3
     */
    get an() {
        return `${this.col}${this.row}`;
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
            row: this.row,
            an: this.an
        };
    }
}

export default Location;