import { isEmpty } from "lodash";
import { LaserBeamDirectionsEnum, PieceTypesEnum } from "./Enums";


class Square {
    /**
     * A square on the board! 
     * It has a location and can also have a piece on it.
     * 
     * @param {Piece} piece 
     * @param {Location} location 
     */
    constructor(piece, location) {
        this.piece = piece;
        this.location = location;
    }

    /**
     * Serializes the Square into an plain object.
     * @returns {Object} plain object, representing this instance
     */
    serialize() {
        return {
            piece: this.piece,
            location: this.location
        };
    }
}

class SquareUtils {
    /**
     * Check if a square has a piece.
     * Returns true when the square has piece in it, otherwise false.
     * 
     * @param {Square} square the square you want to check.
     * @returns {boolean} true when the square has piece in it, otherwise false.
     */
    static hasPiece(square) {
        if (isEmpty(square)) return false;
        return !isEmpty(square.piece);
    }


    /**
     * Returns the direction where the laser is currently pointing, based on it's orientation
     * 
     * @param {Piece} laserPiece the laser piece of which we want to get the direction from.
     * @returns {LaserBeamDirectionsEnum} the laser beam direction
     */
    static getLaserBeamDirection(piece) {
        if (piece) {
            const orientation = piece.orientation;
            if (piece.type === PieceTypesEnum.LASER) {
                switch (orientation) {
                    case 0:
                        return LaserBeamDirectionsEnum.TOP;

                    case 90:
                        return LaserBeamDirectionsEnum.RIGHT;

                    case 180:
                        return LaserBeamDirectionsEnum.BOTTOM;

                    case 270:
                        return LaserBeamDirectionsEnum.LEFT;

                    default:
                        return null;
                }
            }
        }
        // If invalid piece type.
        return null;
    }
}

export default Square;
export { SquareUtils };