import { isString, isEmpty, reduce, toPlainObject } from "lodash";
import { isLowerCase } from "./Utils";
import Square from "../models/Square";
import Location from "../models/Location";
import Piece from "../models/Piece";
import { PlayerTypesEnum } from "../models/Enums";

/**
 * Class representing Setup Notation.
 */
class SN {

    /**
     * Validates a SN according to the notation.
     * @see https://github.com/kishannareshpal/laserchess/blob/master/docs/SetupNotation.md
     * 
     * Constraints:
     *  - Must be a string.
     *  - Must not contain any space.
     *  - Must contain 7 slashes (/) – 8 rows
     *  – Must only contain these chars:
     *      - k or K (case-sensitive)
     *      - s or S (case-sensitive)
     *      - d or D (case-sensitive)
     *      - b or B (case-sensitive)
     *      - l or L (case-sensitive)
     *      - numbers 1~9
     *      - * symbol
     *      - + symbol (in front of a letter only – 0 to 3 chars)
     *      - / symbol
     * 
     * @param {string} notationText SN
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

        const hasNoSpaces = notationText.indexOf(" ") == -1;
        if (!hasNoSpaces) {
            if (throwOnInvalid) {
                throw "Invalid notation – Must not contain space";
            }
            return false;
        }

        const hasEightRows = notationText.split("/").length == 8;
        if (!hasEightRows) {
            if (throwOnInvalid) {
                throw "Invalid notation – Must contain 8 rows (7 slashes)";
            }
            return false;
        }

        const hasValidCharsOnly = (/^([ksdbl1-9*/]\+{0,3})+$/gi).test(notationText);
        if (!hasValidCharsOnly) {
            if (throwOnInvalid) {
                throw "Invalid notation – Must only contain 'ksdbl123456789*/+'";
            }
            return false;
        }

        return true;
    }


    /**
     * Parse a given Setup Notation (SN) string into board!
     * 
     * @param {string} notationText a valid setup SN string.
     * @returns {Array} parsed board with pieces.
     * @see https://github.com/kishannareshpal/laserchess/blob/master/docs/SetupNotation.md
     * 
     * TODO: It validates a row like: "2ldb" (which has 5cols only). Instead, should error and ask to finish the rest of cols with EMPTY squares! Expected: This is what should be valid "2ldb5", by adding 5 empty squares on the end to complete 10cols.
     * 
     */
    static parse(notationText) {
        // Validate the SN. 
        // throw if invalid
        this.validate(notationText, true);

        const notationArray = [];
        const rows = notationText.split("/");
        rows.forEach(row => {
            const colsRaw = row.match(/([ksdbl1-9*]\+{0,3})/gi);
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

        const parsedBoard = notationArray.map((row, rowIndex) => {
            const squares = [];
            row.forEach((col, colIndex) => {
                const location = toPlainObject(new Location(colIndex, rowIndex));

                if (!isEmpty(col)) {
                    const type = col[0]; // type (Kk, Ll, Bb, Dd, Ss)
                    const color = isLowerCase(type) ? PlayerTypesEnum.RED : PlayerTypesEnum.BLUE; // color (red, blue)
                    let orientation = 0; // orientation (0, 90, 180, 270)
                    if (col.indexOf("+") != -1) {
                        const rotations = col.substring(1);
                        orientation = reduce(rotations, (prev) => {
                            return prev + 90;
                        }, 0);
                    }
                    const piece = toPlainObject(new Piece(type, orientation));
                    const square = toPlainObject(new Square(piece, location));
                    squares.push(square);

                } else {
                    const emptySquare = toPlainObject(new Square(null, location));
                    squares.push(emptySquare);
                }
            });
            return squares;
        });

        return parsedBoard;
    }
}

export default SN;