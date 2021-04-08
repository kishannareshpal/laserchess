import { SquareFootRounded } from "@material-ui/icons";
import { isEmpty } from "lodash";
import { LaserDirectionsEnum, PieceTypesEnum, SquareTypesEnum } from "./Enums";


class Square {
    /**
     * A square on the board! 
     * It has a location and can also have a piece on it.
     * 
     * @param {SquareTypesEnum} type the type of the square. Is it only reserved for blue/red pieces?
     * @param {Piece} piece the piece that is inside of the square.
     * @param {Location} location the location of this square in the board.
     */
    constructor(type, piece, location) {
        this.type = type;
        this.piece = piece;
        this.location = location;
    }

    /**
     * Serializes the Square into an plain object.
     * @returns {Object} plain object, representing this instance
     */
    serialize() {
        return {
            type: this.type,
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
     * @returns {LaserDirectionsEnum} the laser beam direction
     */
    static getLaserBeamDirection(piece) {
        if (piece) {
            const orientation = piece.orientation;
            if (piece.type === PieceTypesEnum.LASER) {
                switch (orientation) {
                    case 0:
                        return LaserDirectionsEnum.TOP;

                    case 90:
                        return LaserDirectionsEnum.RIGHT;

                    case 180:
                        return LaserDirectionsEnum.BOTTOM;

                    case 270:
                        return LaserDirectionsEnum.LEFT;

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