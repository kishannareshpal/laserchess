import { LaserBeamDirectionsEnum, PlayerTypesEnum, MovementTypesEnum, LaserHitActionTypesEnum, PieceTypesEnum } from "./Enums";
import Location from "./Location";
import { PieceUtils } from "./Piece";
import { SquareUtils } from "./Square";
import SN from "../utils/SN";
import LHAN from "../utils/LHAN";
import { flatMap, toLower, toUpper } from "lodash";
import Movement from "./Movement";
import { point, polygon } from "@turf/helpers";
import isPointInPolygon from "@turf/boolean-point-in-polygon";


/**
 * @constant
 * Ace
 */
const DEFAULT_BOARD_SN = "l++3d++kd++b+++2/2b7/3B+6/b++1B1ss+1b+++1B+/b+++1B+1S+S1b++1B/6b+++3/7B++2/2B+DKD3L";

/**
 * @constant
 * @type {Object}
 * 
 * Lookup object of individual piece scores.
 */
const PIECE_TO_SCORE = {
    d: 2, // Defender
    b: 1, // Deflector
    s: 0, // Switch
    l: 0 // Laser
    // k: -1000, // King. We ignore adding king's score, because when the king is not present, a default of -1000 will be given and the game is already over.
};


class Board {
    /**
     * @description
     * Intantiate a new board class.
     * 
     * @param {Object} options Use either {@param options.squares} or {@param options.setupNotation}. 
     *                         - Please only pass one of the options. Not both.
     *                         - If both are passed, options.squares will take priority and options.setupNotation will be ignored.
     *                         - If no options object is passed, will initialize the board with the default Ace Board Setup Notation.
     * @param {Array} options.squares Create a new instance of the board class using an already parsed board squares. You may use {@see SN#parse} method to do so.
     * @param {String} options.setupNotation Create a new instance of the board class using a setupNotation
     */
    constructor(options) {
        // Parse the options
        options = options || {};
        if (options.squares) {
            // If squares is provided, prioritize this
            this.squares = options.squares;

        } else if (options.setupNotation) {
            // If setupNotation is provided parse it and set the parsed squares.
            this.squares = SN.parse(options.setupNotation);

        } else {
            // If opts.squares nor opts.setupNotation is provided, use the default (ace) setup notation
            this.squares = SN.parse(DEFAULT_BOARD_SN);
        }
        this.winner = null;
    }


    /**
     * Get a square from the the current board that is at the specified location
     * ? TODO: validate location
     * 
     * @param {Location} location the location of the square on the board.
     * @returns {Square} the square or null if no square was found on the specified location.
     */
    getSquare(location) {
        let row = this.squares[location.rowIndex];
        if (row) {
            let squareAtLocation = row[location.colIndex];
            return squareAtLocation;
        }
        return null;
    }


    /**
     * Get all the squares that contains pieces of the specified player only.
     * 
     * @param {PlayerTypesEnum} player
     * @returns {Array}
     */
    getPlayerSquares(player) {
        // flatten all rows into a single array
        // console.log(board);
        const flattenedSquares = flatMap(this.squares);
        return flattenedSquares.filter((square) => {
            // Filter out the squares with no pieces in it.
            // And only return the pieces of the specified color
            return SquareUtils.hasPiece(square) && square.piece.color === player;
        });
    }


    /**
     * Evaluate a score based on the current board state and pieces available on it for the specified player.
     * @see PIECE_TO_SCORE for the weights of playable piece, used on the evaluation here.
     * 
     * @param {PlayerTypesEnum} player the player of whom we want to evaluate the score
     * @returns {number} the score. If game over, return -100.
     */
    getPlayerScore(player) {
        let playerScore = 0;
        const squaresOfPlayer = this.getPlayerSquares(player);

        // Track the king, to make sure it is is on the board
        let isKingAvailable = false; // we will update this check bellow when we loop through all the pieces on the board

        /**
         * Loop through all of the pieces of this player, and compute the scores 
         * based on our lookup object above 
         * @see PIECE_TO_SCORE the lookup object constant
         */
        squaresOfPlayer.forEach(square => {
            if (square.piece.type === PieceTypesEnum.KING) {
                isKingAvailable = true;
            } else {
                playerScore += PIECE_TO_SCORE[square.piece.type];
            }
        });


        // If the king piece of this color is not in the board.
        // then game over.
        if (!isKingAvailable) {
            return -1000;
        } else {
            return playerScore;
        }
    }


    /**
     * Get the laser path for the laser player when applied on the current board.
     * 
     * @param {PlayerTypesEnum} player the player type
     */
    getLaserPath(player) {
        const path = []; // holds the laser path!
        let lastHitType, lastHitLocation;
        // Get the laser of the player on the move
        // Starting from the laser, start scanning squares in the direction where laser is pointing.
        const an = (player === PlayerTypesEnum.BLUE) ? "j1" : "a8"; // We know exactly where the laser for each player is! As those are immovable pieces.
        const laserSquareLocation = Location.fromAN(an);
        const laserSquare = this.getSquare(laserSquareLocation);
        if (SquareUtils.hasPiece(laserSquare)) {
            // Begin!
            // Get the laser's direction based on it's orientation
            const laserPiece = laserSquare.piece;
            let direction = SquareUtils.getLaserBeamDirection(laserPiece);

            let colIndex = laserSquareLocation.colIndex;
            let rowIndex = laserSquareLocation.rowIndex;
            path.push([colIndex, rowIndex]); // start from the player's laser.

            // Start scanning in the pointing direction of the laser beam
            let isScanning = true;
            while (isScanning) {
                let dx, dy;
                if (direction === LaserBeamDirectionsEnum.TOP) {
                    dx = 0;
                    dy = -1;

                } else if (direction === LaserBeamDirectionsEnum.RIGHT) {
                    dx = 1;
                    dy = 0;

                } else if (direction === LaserBeamDirectionsEnum.BOTTOM) {
                    dx = 0;
                    dy = 1;

                } else if (direction === LaserBeamDirectionsEnum.LEFT) {
                    dx = -1;
                    dy = 0;

                }
                colIndex += dx;
                rowIndex += dy;

                // Make sure the indexes are not out of bound from the board.
                if ((rowIndex < 0 || rowIndex > 7) || (colIndex < 0 || colIndex > 9)) {
                    // If it is out of bound. Stop the laser.
                    isScanning = false;
                    continue;
                }
                path.push([colIndex, rowIndex]);

                // Get the next square in that direction!
                const nextScanningSquareLocation = new Location(colIndex, rowIndex);
                const nextScanningSquare = this.getSquare(nextScanningSquareLocation);

                // Check if it has a piece
                if (SquareUtils.hasPiece(nextScanningSquare)) {
                    // If piece was found, get the hit action and do something.
                    const action = LHAN.getHitAction(direction, nextScanningSquare.piece);
                    if (action.type === LaserHitActionTypesEnum.KILL) {
                        // The piece in this square should be killed/eaten/captured.
                        isScanning = false;

                    } else if (action.type === LaserHitActionTypesEnum.DEFLECT) {
                        // The piece in this square changes the direction of my laser beam.
                        direction = action.newDirection;

                    } else if (action.type === LaserHitActionTypesEnum.NOTHING) {
                        // The piece in this square is probably (1) another laser or (2) a defender
                        // So, do nothing! Stop the laser now.
                        isScanning = false;
                    }

                    lastHitType = action.type;

                } else {
                    // Continue if no piece in the scanning square.
                    // Did nothing.
                    lastHitType = LaserHitActionTypesEnum.NOTHING;
                }

                lastHitLocation = nextScanningSquareLocation;
            }
        }
        return {
            lastHitType,
            lastHitLocation,
            path
        };
    }


    /**
     * Returns all moves for all of the pieces of the specified player.
     * 
     * @param {PlayerTypesEnum} player
     * @returns {Movement[]}
     */
    getMovesForPlayer(player) {
        const moves = [];
        const squaresOfPlayer = this.getPlayerSquares(player);
        squaresOfPlayer.forEach(square => {
            const movesForPiece = this.getMovesForPieceAtLocation(square.location);
            if (movesForPiece.length !== 0) {
                // append if there are any moves available for said piece
                moves.push(...movesForPiece);
            }
        });
        return moves;
    }


    /**
     * Get all moves for a particular piece at the specified location
     * 
     * @param {Location} location the location on which the piece to get the moves is.
     * @returns {Movement[]} a list of all Movement possible for the piece in that location
     */
    getMovesForPieceAtLocation(location) {
        const moves = [];

        const srcX = location.colIndex;
        const srcY = location.rowIndex;
        /**
         * Every piece, except for Laser, has a maximum of 10 possible moves (to it's neighbor squares and rotating) on it's turn: 
         * - TOP_LEFT, TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, ROTATION_CLOCKWISE, ROTATION_C_CLOCKWISE
         * The Laser pieces are immovable throughout the entire game.
         * 
         * -------------
         * |TL| |T| |TR|
         * -------------
         * |L|  |x|  |R|
         * -------------
         * |BL| |B| |BR|
         * -------------
         * Where X is our srcLocation (where the piece we are moving is originally located).
         */
        const possibilities = [
            [srcX - 1, srcY - 1], // TL
            [srcX + 0, srcY - 1], // T
            [srcX + 1, srcY - 1], // TR
            [srcX + 1, srcY + 0], // R
            [srcX + 1, srcY + 1], // BR
            [srcX + 0, srcY + 1], // B
            [srcX - 1, srcY + 1], // BL
            [srcX - 1, srcY + 0], // L
        ];

        possibilities.forEach(([dx, dy]) => {
            // Make sure that dx and dy are inside the bounds of the board
            const dxIsInsideTheBoard = (dx >= 0 && dx < 10); // 10 is the maximum number of cols (actually it's 9 in array because of 0-based-index, hence why we are using less-than sign)
            const dyIsInsideTheBoard = (dy >= 0 && dy < 8); // 8 is the maximum number of rows (actually it's 7 in array because of 0-based-index, hence why we are using less-than sign)
            if (!(dxIsInsideTheBoard && dyIsInsideTheBoard)) {
                return; // skip to next itteration, because this dx or dy is outside the bound of the board.
            }

            const possibleDestLocation = new Location(dx, dy);
            const movePossibility = this.checkMovePossibility(location, possibleDestLocation);

            if (movePossibility.type !== MovementTypesEnum.INVALID) {
                // Only return moves that are possible
                moves.push(movePossibility);
            }
        });

        // TODO: add rotation possibility as well
        return moves;
    }

    /**
     * Checks if a specific movement is possible into that square.
     * Allows special move for Switch piece.
     * 
     * TODO: add rotation possibility as well
     *
     * @param {Location} srcLocation the square from where we are moving from.
     * @param {Location} destLocation the square to where we are moving.
     * @returns {Movement} which can contain a type of MovementTypesEnum#INVALID when the move is not possible
     */
    checkMovePossibility(srcLocation, destLocation) {
        const squareAtSrc = this.getSquare(srcLocation);
        const squareAtDest = this.getSquare(destLocation);


        if ((squareAtDest === null) || (squareAtSrc.piece.type === PieceTypesEnum.LASER)) {
            // Invalid destLocation, as it has no square there. Most likely this is out of bound.
            // Or, we are trying to move a Laser Piece, which is not a possible move according to the rules of the game.
            // Return as not possible to move.
            return new Movement(MovementTypesEnum.INVALID, srcLocation, destLocation);
        }

        const pieceTypeAtSrc = squareAtSrc.piece.type;
        const pieceTypeAtDest = squareAtDest.piece ? squareAtDest.piece.type : null;

        // Special Move (swap)
        if ((pieceTypeAtSrc === PieceTypesEnum.SWITCH) &&
            (pieceTypeAtDest === PieceTypesEnum.DEFENDER || pieceTypeAtDest === PieceTypesEnum.DEFLECTOR)) {
            // If the piece is a switch, 
            // allow swap if the destination piece is either a defender or deflector of any color!
            return new Movement(MovementTypesEnum.SPECIAL, srcLocation, destLocation);

        } else {
            // Normal movement (to an empty neighbor square)
            if (SquareUtils.hasPiece(squareAtDest)) {
                // Trying to move into a square which already has a piece (and is not a valid swap).
                // Invalid move
                return new Movement(MovementTypesEnum.INVALID, srcLocation, destLocation);

            } else {
                return new Movement(MovementTypesEnum.NORMAL, srcLocation, destLocation);
            }
        }
    }


    // Setters

    /**
     * Apply a movement to this board
     * @param {Movement} movement the movement to be applied on the board
     */
    applyMovement(movement) {
        const squareAtSrc = this.getSquare(movement.srcLocation);
        // Check what type of move is being performed
        if (movement.type === MovementTypesEnum.NORMAL) { // dislocate
            // Normal movement (from one square to an empty one)
            const squareAtDest = this.squares[movement.destLocation.rowIndex][movement.destLocation.colIndex];
            // Move the piece from the src to dest.
            squareAtDest.piece = squareAtSrc.piece;
            squareAtSrc.piece = null;

        } else if (movement.type === MovementTypesEnum.ROTATION_CLOCKWISE) {
            // Rotation movement (clockwise)
            const clockwise = true;
            PieceUtils.applyRotation(squareAtSrc.piece, clockwise);

        } else if (movement.type === MovementTypesEnum.ROTATION_C_CLOCKWISE) {
            // Rotation movement (counter-clockwise)
            const c_clockwise = false;
            PieceUtils.applyRotation(squareAtSrc.piece, c_clockwise);

        } else if (movement.type === MovementTypesEnum.SPECIAL) {
            // Special movement (Switch piece is swapping places with either a Deflector or Defender piece)
            const squareAtDest = this.getSquare(movement.destLocation);

            // Swap the pieces.
            const squareAtSrcPiece = squareAtSrc.piece;
            squareAtSrc.piece = squareAtDest.piece;
            squareAtDest.piece = squareAtSrcPiece;
        }
    }


    applyLaser(player) {
        if (!player) {
            throw new Error("applyLaser - Please specify the player whose laser is being switched on.");
        }

        // Now compute the new laser beam path
        const { lastHitType, lastHitLocation, path } = this.getLaserPath(player);

        // handle the laser hit
        if (lastHitType === LaserHitActionTypesEnum.KILL) {
            const squareAtHit = this.squares[lastHitLocation.rowIndex][lastHitLocation.colIndex];
            // Check if we killed the King!
            if (squareAtHit.piece.type === PieceTypesEnum.KING) {
                // Oh lord, the king is dead, I repeat, the king is dead!
                // Check which king is dead and declare the winner! 🏴‍☠️ 
                const winnerPlayerColor = squareAtHit.piece.color === PlayerTypesEnum.BLUE ? PlayerTypesEnum.RED : PlayerTypesEnum.BLUE;
                this.winner = winnerPlayerColor;

            }
            // Remove the piece from the square.
            squareAtHit.piece = null;
        }

        return path;
    }


    /**
     * Returns a new board from move without modifying current board.
     * @param {Movement} movement the movement being performed on the board
     * @param {PlayerTypesEnum} player the player that is moving
     */
    newBoardFromMovement(movement, player) {
        const newBoard = new Board({ setupNotation: this.toSN() }); // clone this board
        newBoard.applyMovement(movement);
        newBoard.applyLaser(player);
        return newBoard;
    }


    /**
     * Converts the current board into Setup Notation string.
     * @returns {string} SN string
     */
    toSN() {
        let sn = "";
        let emptySquaresCount = 0;

        this.squares.forEach((row, rowIndex) => {
            row.forEach((square, colIndex) => {
                if (SquareUtils.hasPiece(square)) {
                    if (emptySquaresCount > 0) {
                        sn += `${emptySquaresCount}`;
                        emptySquaresCount = 0;
                    }

                    // type?
                    if (square.piece.color === PlayerTypesEnum.BLUE) {
                        // Blue uses upper case letters for piece type representation (L D B K S)
                        sn += toUpper(square.piece.type);

                    } else {
                        // Red uses lower case letter for piece type representation (l d b k s);
                        sn += toLower(square.piece.type);
                    }

                    // orientation?
                    const orientation = square.piece.orientation;
                    sn += _.repeat("+", orientation / 90);

                } else {
                    emptySquaresCount += 1;
                }
            });

            if (emptySquaresCount > 0) {
                sn += `${emptySquaresCount === 10 ? "*" : emptySquaresCount}`; // on 10 empty spaces show "*" instead of (10)
                emptySquaresCount = 0; // reset
            }

            // Append / to sepparate rows, but not at the end of the notation.
            if (rowIndex !== 7) {
                sn += "/"; // separates the rows
            }
        });
        return sn;
    }


    /**
     * Serializes the Board object into an Object.
     * @returns {Object} plain object, representing this instance
     */
    serialize() {
        return {
            winner: this.winner,
            squares: this.squares,
            sn: this.toSN() // setup notation
        };
    }


    // CLI Related (dev only)

    /**
     * Logs a prettier version of SN into the CLI
     */
    _viewInCLI() {
        let sn = "";
        let emptySquaresCount = 0;

        this.squares.forEach((row, rowIndex) => {
            row.forEach((square, colIndex) => {
                if (SquareUtils.hasPiece(square)) {

                    if (emptySquaresCount > 0) {
                        sn += `${emptySquaresCount}`;
                        emptySquaresCount = 0;
                    }

                    // type?
                    if (square.piece.color === PlayerTypesEnum.BLUE) {
                        // Blue uses upper case letters for piece type representation (L D B K S)
                        sn += toUpper(square.piece.type);

                    } else {
                        // Red uses lower case letter for piece type representation (l d b k s);
                        sn += toLower(square.piece.type);
                    }

                    sn += " ";

                    // orientation?
                    // const orientation = square.piece.orientation;
                    // sn += _.repeat("+", orientation / 90);

                } else {
                    sn += ". ";
                }
            });

            // Append / to sepparate rows, but not at the end of the notation.
            if (rowIndex !== 7) {
                sn += "\n"; // separates the rows
            }
        });
        console.log(sn);
    }


    /**
     * Check if a piece a srcLocation is moving to a neighboring location.
     * Uses the point-in-polygon concept.
     * 
     * @param {Location} srcLocation the source location
     * @param {Location} destLocation the destination location
     * @returns {boolean} true if the destLocation square is a neighboring square, otherwise false for every other square.
     */
    static isMovingToNeighborSquare(srcLocation, destLocation) {
        /**
         * Minimum squares to be moved to, given xy as srcLocation
         * 
         * -x-y | x-y | +x-y
         *  -xy | xy  | +xy
         * -x+y | x+y | +x+y
         */
        const srcX = srcLocation.colIndex;
        const srcY = srcLocation.rowIndex;
        const destX = destLocation.colIndex;
        const destY = destLocation.rowIndex;

        /**
         * A polygon containing the possible moving squares for the srcLocation.
         * That is, the neighbouring squares.
         * 
         *
         * -----------
         * |a| | | |d|
         * -----------
         * | | |x| | |
         * -----------
         * |b| | | |c|
         * -----------
         * Where X is our srcLocation.
         * 
         * @see https://github.com/kishannareshpal/laserchess/blob/master/docs/Guide.md#How-to-play-steps
         */
        const possiblePoly = polygon([[
            [srcX - 1, srcY - 1], // a
            [srcX - 1, srcY + 1], // b
            [srcX + 1, srcY + 1], // c
            [srcX + 1, srcY - 1], // d
            [srcX - 1, srcY - 1] // closing point – back to a
        ]]);

        // Check if the destLocation is one of the neighboring squares of the srcLocation
        const destPoint = point([destX, destY]); // x
        return isPointInPolygon(destPoint, possiblePoly);
    }
}

export default Board;