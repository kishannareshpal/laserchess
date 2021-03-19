import Location, { LocationUtils } from "../models/Location";
import { point, polygon } from "@turf/helpers";
import isPointInPolygon from "@turf/boolean-point-in-polygon";
import BoardUtils from "../models/BoardUtils";
import { SquareUtils } from "../models/Square";
import { LaserBeamDirectionsEnum, PieceTypesEnum, LaserHitActionTypesEnum, MovementTypesEnum } from "../models/Enums";
import LHAN from "../utils/LHAN";
import { toPlainObject } from "lodash";

class Engine {

    /**
     * Get all possible moves from the piece at srcLocation square.
     * 
     * @param {*} srcLocation The location of the selected piece you want to check the moves for
     * @param {*} board Current board
     * @returns {Array<Object>} [ { type: MovementTypesEnum, isPossible: Boolean, destLocation: Location } ]
     */
    static checkAllMovePossibilities(srcLocation, board) {
        const possibilities = [];

        const srcX = srcLocation.colIndex;
        const srcY = srcLocation.rowIndex;
        /**
         * Every piece, except for Laser, has 10 possible moves (to it's neighbor squares) on it's turn: 
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
         * Where X is our srcLocation.
         */
        const moves = [
            [srcX - 1, srcY - 1], // TL
            [srcX + 0, srcY - 1], // T
            [srcX + 1, srcY - 1], // TR
            [srcX + 1, srcY + 0], // R
            [srcX + 1, srcY + 1], // BR
            [srcX + 0, srcY + 1], // B
            [srcX - 1, srcY + 1], // BL
            [srcX - 1, srcY + 0], // L
        ];

        moves.forEach(([dx, dy]) => {
            // Make sure that dx and dy are inside the bounds of the board
            const dxIsInsideTheBoard = (dx >= 0 && dx < 10); // 10 is the maximum number of cols (actually it's 9 in array because of 0-based-index, hence why we are using less-than sign)
            const dyIsInsideTheBoard = (dy >= 0 && dy < 8); // 8 is the maximum number of rows (actually it's 7 in array because of 0-based-index, hence why we are using less-than sign)
            if (!(dxIsInsideTheBoard && dyIsInsideTheBoard)) {
                return; // skip to next itteration, because the dx or dy is outside the bound of the board.
            }

            const possibleDestLocation = new Location(dx, dy);
            const possibility = this.checkMovePossibility(srcLocation, possibleDestLocation, board);
            // Only return the possible moves.
            if (possibility.isPossible) {
                possibility.destLocation = possibleDestLocation; // Add the possibleDestLocation to the return object.
                possibilities.push(possibility);
            }
        });

        // TODO: add orientation aswell.
        return possibilities;
    }


    /**
     * Check if a piece a srcLocation is moving to a neighboring location.
     * Uses the point-in-polygon concept.
     * 
     * @param {Location} srcLocation the source location
     * @param {Location} destLocation the destination location
     * @returns {boolean} true if the destLocation square is a neighboring square, otherwise false for every other square.
     */
    static isMovingToNeighbor(srcLocation, destLocation) {
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



    /**
     * Checks if the movement is possible into that square.
     * Allows special move for Switch piece.
     *
     * @param {Location} srcLocation the square from where we are moving from.
     * @param {Location} destLocation the square to where we are moving.
     * @param {Array} board the current board.
     * @returns {object} { type: MovementTypesEnum, isPossible: Boolean }
     */
    static checkMovePossibility(srcLocation, destLocation, board) {
        const squareAtSrc = BoardUtils.getSquareAtLocation(board, srcLocation);
        const squareAtDest = BoardUtils.getSquareAtLocation(board, destLocation);

        if (squareAtDest === null || squareAtSrc.piece === PieceTypesEnum.LASER) {
            // The square at the given destination location is not a square inside the board.
            // So we automatically return as not possible to move.
            return {
                type: MovementTypesEnum.INVALID,
                isPossible: false
            };
        }

        const pieceTypeAtSrc = squareAtSrc.piece.type;
        const pieceTypeAtDest = squareAtDest.piece ? squareAtDest.piece.type : null;

        // Special Move. Only with the player's own pieces.
        if ((pieceTypeAtSrc === PieceTypesEnum.SWITCH) &&
            (pieceTypeAtDest === PieceTypesEnum.DEFENDER || pieceTypeAtDest === PieceTypesEnum.DEFLECTOR)) {
            // If the piece is a switch, 
            // allow move if the destination piece is either a defender or deflector
            // TODO: Do not allow swapping with pieces of another player! Blue Switch Piece cannot switch with a red defender or deflector piece.
            return {
                type: MovementTypesEnum.SPECIAL,
                isPossible: true
            };

        } else {
            // Normal movement (to an empty neighbor square)
            return {
                type: MovementTypesEnum.NORMAL,
                isPossible: !SquareUtils.hasPiece(squareAtDest)
            };
        }
    }


    /**
     * Get the path of the laser beam for the current board
     * 
     * @param {Board} board Current state of the board
     * @param {string} player The player in turn who is enabling the laser (either "blue" or "red")
     * @returns {object} { lastHitType: lastHitLocation, lastHitSquareLocation: Location, path: [] } 
     *                   – The path of the laser beam on the current board. [x1, x2, ...] a flattened array of points.
     */
    static computeLaserPath(board, player) {
        const path = []; // holds the laser path!
        let lastHitType, lastHitLocation;
        // Get the laser of the player on the move
        // Starting from the laser, start scanning squares in the direction where laser is pointing.
        const an = (player === "blue") ? "j1" : "a8"; // We know exactly where the laser for each player is! As those are immovable pieces.
        const laserSquareLocation = LocationUtils.parse(an);
        const laserSquare = BoardUtils.getSquareAtLocation(board, laserSquareLocation);
        if (SquareUtils.hasPiece(laserSquare)) {
            // Begin!
            // Get the laser's direction based on it's orientation
            const laserPiece = laserSquare.piece;
            let direction = SquareUtils.getLaserBeamDirection(laserPiece);

            let colIndex = laserSquareLocation.colIndex;
            let rowIndex = laserSquareLocation.rowIndex;
            path.push(colIndex, rowIndex); // start from the player's laser.

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
                path.push(colIndex, rowIndex);

                // Get the next square in that direction!
                const nextScanningSquareLocation = new Location(colIndex, rowIndex);
                const nextScanningSquare = BoardUtils.getSquareAtLocation(board, nextScanningSquareLocation);

                // Check if it has a piece
                if (SquareUtils.hasPiece(nextScanningSquare)) {
                    // If piece was found, get the hit action and do something.
                    const action = LHAN.getHitAction(direction, nextScanningSquare.piece);
                    if (action.type === LaserHitActionTypesEnum.KILL) {
                        // The piece in this square should be killed/eaten/captured.
                        // todo: remove the piece from the board!
                        // console.log("Piece killed!");
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
            lastHitLocation: toPlainObject(lastHitLocation),
            path
        };
    }

}


export default Engine;