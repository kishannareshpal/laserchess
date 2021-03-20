import { isString, isEmpty, toPlainObject } from "lodash";
import Cell from "../models/Cell";
import { CellTypesEnum } from "../models/Enums";
import Location from "../models/Location";
import { isLowerCase } from "./Utils";

/**
 * The pattern used to check notationText for invalid chars
 * @constant
 * @type {RegExp}
 */
const BGN_VALID_CHARS_PATTERN = /^([rl1-9*/])+$/gi;

/**
 * The pattern used to extract a valid the cell in the grid.
 * @constant
 * @type {RegExp}
 */
const BGN_VALID_CELL_CHARS_PATTERN = /([rl1-9*])/gi;


/**
 * Class representing Board Grid Notation.
 * - This is based on {@see SN Setup Notation}, but used for the board setup.
 */
class BGN {
    /**
     * Validates a BGN according to the notation.
     * @see https://github.com/kishannareshpal/laserchess/blob/master/docs/BoardNotation.md
     * TODO: It validates a row like: "2lrR" (which has 5cols only). Instead, should error and ask to finish the rest of cols with EMPTY squares! Expected: This is what should be valid "2lrH5", by adding 5 empty squares on the end to complete 10cols.
     * 
     * Constraints:
     *  - Must be a string.
     *  - Must not contain any space.
     *  - Must contain 7 slashes (/) – 8 rows
     *  – Must only contain these chars:
     *      - r or R (case-sensitive)
     *      - l or L (case-sensitive)
     *      - numbers 1~9
     *      - * symbol
     *      - / symbol
     * 
     * @param {string} notationText BGN
     * @param {boolean} throwOnInvalid (optional – default=false) if true, it will throw an Error for invalid notationText}. Otherwise will just return false for invalid notationText.
     * @returns {boolean} true if valid, otherwise false or will throw if throwOnInvalid param is set to true.
     * @throws Invalid Notation if notation is invalid, and the throwOnInvalid param is set to true.
     */
    static validate(notationText, throwOnInvalid = false) {
        if (!isString(notationText)) {
            if (throwOnInvalid) {
                throw "Invalid notation – Must be string";
            }
            return false;
        }

        const hasNoSpaces = notationText.indexOf(" ") === -1;
        if (!hasNoSpaces) {
            if (throwOnInvalid) {
                throw "Invalid notation – Must not contain space";
            }
            return false;
        }

        const hasEightRows = notationText.split("/").length === 8;
        if (!hasEightRows) {
            if (throwOnInvalid) {
                throw "Invalid notation – Must contain 8 rows (7 slashes)";
            }
            return false;
        }

        const hasValidCharsOnly = BGN_VALID_CHARS_PATTERN.test(notationText);
        if (!hasValidCharsOnly) {
            if (throwOnInvalid) {
                throw "Invalid notation – Must only contain 'rRlL123456789*/'";
            }
            return false;
        }

        return true;
    }


    /**
     * Parse a given Board Grid Notation (BGN) string into an array!
     * 
     * @param {string} notationText a valid setup SN string.
     * @returns {Array} parsed board with pieces.
     * @see https://github.com/kishannareshpal/laserchess/blob/master/docs/BoardGridNotation.md
     * 
     */
    static parse(notationText) {
        // Validate the BGN. 
        // throw if invalid
        this.validate(notationText, true);

        const notationArray = [];
        const rows = notationText.split("/");
        rows.forEach(row => {
            const colsRaw = row.match(BGN_VALID_CELL_CHARS_PATTERN);
            const cols = colsRaw.flatMap(col => {
                if (col == "*") {
                    col = 10;
                }
                if (parseInt(col)) {
                    return new Array(parseInt(col)).fill("");
                }
                return col;
            });
            notationArray.push(cols);
        });

        const boardCells = notationArray.map((row, rowIndex) => {
            const cells = [];
            row.forEach((col, colIndex) => {
                const location = toPlainObject(new Location(colIndex, rowIndex));
                if (!isEmpty(col)) {
                    const type = col[0];
                    const cell = toPlainObject(new Cell(type, location));
                    cells.push(cell);

                } else {
                    const type = CellTypesEnum.NORMAL;
                    const cell = toPlainObject(new Cell(type, location));
                    cells.push(cell);
                }
            });
            return cells;
        });

        return boardCells;
    }
}

export default BGN;