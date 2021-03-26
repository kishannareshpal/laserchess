import { isString, isEmpty, reduce } from "lodash";
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
        // throw on invalid notation
        this.validate(notationText, true);

        const notationArray = [];
        const rows = notationText.split("/");
        rows.forEach((row, rowIndex) => {
            // Make sure it only has valid characters
            const colsRaw = row.match(/([ksdbl1-9*]\+{0,3})/gi);

            // Track the number of columns so we can validate rows, which must have only 10 squares (cols)! 
            let squaresCount = 0;
            const cols = colsRaw.flatMap(col => {
                if (col === "*") {
                    // It's 10 empty spaces.
                    // Transform it into the literal number 10, so i can map it into 10 empty squares.
                    col = 10;
                }

                if (isNaN(col)) {
                    // It's a letter (which represents the piece type and color, and optionally the orientation)
                    // Increment the column count.
                    // - ignore + symbols(which represents orientation) as it adds no squares(cols) to a row.
                    squaresCount += 1;
                    return col;
                } else {
                    // It's a number (which represents the number of empty spaces from this col)
                    // Increment the number of cols
                    const numberOfEmptySquares = parseInt(col);
                    squaresCount += numberOfEmptySquares;
                    return new Array(numberOfEmptySquares).fill("");
                }
            });

            // Make sure that the row has 10 cols.
            if (squaresCount !== 10) {
                throw `Invalid Notation – Must contain 10 Columns per Row. Found ${squaresCount} Columns in row ${rowIndex + 1} instead`;
            }

            notationArray.push(cols);
        });

        const parsedBoard = notationArray.map((row, rowIndex) => {
            const squares = [];
            row.forEach((col, colIndex) => {
                const location = new Location(colIndex, rowIndex).serialize();

                if (!isEmpty(col)) {
                    const type = col[0]; // type (Kk, Ll, Bb, Dd, Ss)
                    let orientation = 0; // orientation (0, 90, 180, 270)
                    if (col.indexOf("+") != -1) {
                        const rotations = col.substring(1);
                        orientation = reduce(rotations, (prev) => {
                            return prev + 90;
                        }, 0);
                    }
                    const piece = new Piece(type, orientation).serialize();
                    const square = new Square(piece, location).serialize();
                    squares.push(square);

                } else {
                    const emptySquare = new Square(null, location).serialize();
                    squares.push(emptySquare);
                }
            });
            return squares;
        });

        return parsedBoard;
    }
}

export default SN;