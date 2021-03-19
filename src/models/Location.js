/**
 * Defaults
 */
const COLS_IN_NOTATION = "abcdefghij";


class Location {
    constructor(colIndex, rowIndex) {
        this.colIndex = colIndex;
        this.rowIndex = rowIndex;
        this.col = COLS_IN_NOTATION.charAt(colIndex);
        this.row = 8 - rowIndex;
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