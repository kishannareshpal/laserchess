import { isString, isEmpty, reduce } from "lodash";
import type { CellType, OrientationDegrees, PieceType, PlayerType } from "@/types";
import type { Cell, CellGrid } from "@/models/cell";
import type { Location } from "@/models/location";
import type { Piece } from "@/models/piece";
import { PieceHelper } from "@/models/helpers/piece-helper";
import { nanoid } from 'nanoid';


// const boardGridNotationText = "lR6rR/r8R/r8R/r8R/r8R/r8R/r8R/rR6rL";

// TODO: what's this used for?
// const SPECIAL_SQUARES: { location_an: string, type: SquareType }[] = [
//     {
//         location_an: "a8",
//         type: 'laser-red'
//     },
//     {
//         location_an: "j1",
//         type: 'laser-blue'
//     },
//     {
//         location_an: "j8",
//         type: 'laser-blue'
//     }
// ];


/**
 * Class representing Setup Notation.
 */
export class SN {

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
    static validate(notationText: string, throwOnInvalid: boolean = false): boolean {
        if (!isString(notationText)) {
            if (throwOnInvalid) {
                throw "Invalid notation - Must be string";
            }
            return false;
        }

        const hasNoSpaces = notationText.indexOf(" ") === -1;
        if (!hasNoSpaces) {
            if (throwOnInvalid) {
                throw "Invalid notation - Must not contain space";
            }
            return false;
        }

        const hasEightRows = notationText.split("/").length === 8;
        if (!hasEightRows) {
            if (throwOnInvalid) {
                throw "Invalid notation - Must contain 8 rows (7 slashes)";
            }
            return false;
        }

        const hasValidCharsOnly = (/^([ksdbl1-9*/]\+{0,3})+$/gi).test(notationText);
        if (!hasValidCharsOnly) {
            if (throwOnInvalid) {
                throw "Invalid notation - Must only contain 'ksdbl123456789*/+'";
            }
            return false;
        }

        return true;
    }


    /**
     * Parse a given Setup Notation (SN) string into board!
     * 
     * @param notationText a valid setup SN string.
     * @returns parsed board with pieces.
     * @see https://github.com/kishannareshpal/laserchess/blob/master/docs/SetupNotation.md
     * 
     * TODO: It validates a row like: "2ldb" (which has 5cols only). Instead, should error and ask to finish the rest of cols with EMPTY squares! Expected: This is what should be valid "2ldb5", by adding 5 empty squares on the end to complete 10cols.
     * 
     */
    static parse(notationText: string): CellGrid {
        // Validate the SN. 
        // throw on invalid notation
        this.validate(notationText, true);

        const notationArray = [];
        const rows: string[] = notationText.split("/");
        rows.forEach((row, rowIndex) => {
            // Make sure it only has valid characters
            const colsRaw = row.match(/([ksdbl1-9*]\+{0,3})/gi);

            // Track the number of columns so we can validate rows, which must have only 10 squares (cols)! 
            let squaresCount = 0;
            const cols = colsRaw.flatMap((col: string) => {
                if (col === '*' || !isNaN(parseInt(col))) {
                    // It's a number (which represents n empty squares) or the * symbol (which represents 10 empty squares)
                    // Increment the number of cols
                    const numberOfEmptySquares = parseInt(col);
                    squaresCount += numberOfEmptySquares;
                    return new Array(numberOfEmptySquares).fill("");
                } else {
                    // It's a letter (which represents the piece type and color, and optionally the orientation)
                    // Increment the column count.
                    // - ignore + symbols(which represents orientation) as it adds no squares(cols) to a row.
                    squaresCount += 1;
                    return col;
                }
            });

            // Make sure that the row has 10 cols.
            if (squaresCount !== 10) {
                throw `Invalid Notation - Must contain 10 Columns per Row. Found ${squaresCount} Columns in row ${rowIndex + 1} instead`;
            }

            notationArray.push(cols);
        });

        return notationArray.map((row, rowIndex) => {
            const cells = [];
            row.forEach((col, colIndex) => {
                const location: Location = { colIndex, rowIndex };

                let piece: Piece | null = null; // holds the piece on this cell, if any. Otherwise null
                let cellType: CellType = 'normal'; // holds the type of cell in this location.

                // Check if we need a piece on this square
                if (!isEmpty(col)) {
                    // Determine the player this piece belongs to
                    const pieceType: PieceType = PieceHelper.determinePieceType(col[0]); // type (k, l, b, d, s)
                    const playerType: PlayerType = PieceHelper.determinePlayerTypeForPiece(col[0]) // type (Kk, Ll, Bb, Dd, Ss)

                    // Determine the orientation
                    let orientation: OrientationDegrees = 0; // orientation in 90deg increments (0, 90, 180, 270)
                    if (col.indexOf("+") != -1) {
                        const rotations = col.substring(1);
                        orientation = reduce(rotations, (prev) => {
                            return (prev + 90) as OrientationDegrees;
                        }, 0);
                    }

                    piece = { type: pieceType, playerType: playerType, orientation }
                }

                if (colIndex === 0 && rowIndex === 0) {
                    // This square is reserved for the red player's laser piece only.
                    // No other piece can be put in here
                    cellType = 'laser-player-two';

                } else if (colIndex === 9 && rowIndex === 7) {
                    // This square is reserved for the blue player's laser piece only. 
                    // No other piece can be put in here
                    cellType = 'laser-player-one';

                } else if ((colIndex === 0 && (rowIndex >= 1 && rowIndex <= 7) ||
                    (colIndex === 8 && (rowIndex === 0 || rowIndex === 7)))) {
                    // To facilitate your reading, this statement basically matches:
                    //  - Squares at Column: 0 and Rows: in between 1 and 7
                    //  - Square at Column: 8 and Rows: either 0 or 7
                    // These squares are reserved for pieces of the red player only.
                    // The other player pieces cannot be put or moved into these squares.
                    cellType = 'reserved-player-two';

                } else if ((colIndex === 1 && (rowIndex === 0 || rowIndex === 7)) ||
                    (colIndex === 9 && (rowIndex >= 0 && rowIndex <= 6))) {
                    // To facilitate your reading, this statement basically matches:
                    //  - Squares at Column: 9 and Rows: in between 0 and 6
                    //  - Square at Column: 1 and Rows: either 0 or 7
                    // These squares are reserved for pieces of the blue player only.
                    // The other player pieces cannot be put or moved into these squares.
                    cellType = 'reserved-player-one';
                }

                const cell: Cell = {
                    id: nanoid(),
                    type: cellType,
                    location,
                    piece
                };
                cells.push(cell);
            });

            return cells;
        });
    }
}