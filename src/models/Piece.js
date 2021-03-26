import { PieceTypesEnum, PlayerTypesEnum } from "../models/Enums";
import { isLowerCase } from "../utils/Utils";

class Piece {
    /**
     * A class representing a single piece.
     * 
     * @param {string} type the type of the piece. Use PieceTypesEnum
     * @param {Number} orientation (0, 90, 180, 270) the current orientation of the piece.
     *
     * @see PieceTypesEnum for type param
     */
    constructor(type, orientation) {
        this.color = isLowerCase(type) ? PlayerTypesEnum.RED : PlayerTypesEnum.BLUE; // color (red, blue)
        this.type = type.toLowerCase();
        this.orientation = orientation;
        this.imageName = `${this.color}-${PieceUtils.getPieceName(type)}`;
    }

    /**
     * Serializes the Piece object into an Object.
     * @returns {Object} plain object, representing this instance
     */
    serialize() {
        return {
            color: this.color,
            type: this.type,
            orientation: this.orientation,
            imageName: this.imageName
        };
    }

}


class PieceUtils {

    /**
     * Get the piece name.
     * 
     * @returns {string} the piece name. See example:
     * @example 
     * "king"
     * "laser"
     * "defender"
     * ...
     */
    static getPieceName(pieceType) {
        switch (pieceType.toLowerCase()) {
            case PieceTypesEnum.KING:
                return "king";

            case PieceTypesEnum.LASER:
                return "laser";

            case PieceTypesEnum.DEFENDER:
                return "defender";

            case PieceTypesEnum.DEFLECTOR:
                return "deflector";

            case PieceTypesEnum.SWITCH:
                return "switch";
        }
    }


    /**
     * Rotates a piece clockwise or counter-clockwise.
     * Mutates the piece directly. Returns nothing.
     * 
     * @param {Piece} piece the piece to rotate
     * @param {boolean} clockwise if true will rotate clockwise, otherwise counter-clockwise
     * @example
     * 0  -> cw   -> 0 + 90 = 90
     * 0  -> ccw  -> 0 + (360 - 90) = 270 // to avoid negative orientation
     * 90  -> cw  -> 90 + 90 = 180
     * 90  -> ccw -> 90 - 90 = 0
     * 180 -> cw  -> 180 + 90 = 270
     * 180 -> ccw -> 180 - 90 = 90
     * 270 -> cw  -> 270 + 90 = 360
     * 270 -> ccw -> 270 - 90 = 180
     * 
     */
    static applyRotation(piece, clockwise = true) {
        // Check if clockwise (default) or counter-clockwise
        if (clockwise) {
            // clockwise
            if (piece.orientation == 270) {
                // If current orientation is 270, when rotating clockwise normally it would've been 360.
                // But we are reseting back to 0, because 360º is the same as 0º.
                piece.orientation = 0;

            } else {
                // Rotate 90º clockwise
                piece.orientation += 90;
            }

        } else {
            // counter-clockwise
            if (piece.orientation == 0) {
                // If current orientation is 0, when rotating counter-clowise normally it would've been -90
                // But to avoid negative orientation, we use 270º which is the same as -90º.
                piece.orientation = 270;

            } else {
                // Rotate 90º counter-clockwise
                piece.orientation -= 90;
            }
        }
    }
}

export default Piece;
export { PieceUtils };