import type { LaserDirection, SquareType } from "@/types";
import type { Piece_Depr, SerializedPiece } from "./Piece";
import { isEmpty } from "@legendapp/state";
import { Location_Depr, type SerializedLocation } from "./Location";

export type SerializedSquare = {
    type: SquareType,
    piece: SerializedPiece,
    location: SerializedLocation
}

export class Square_Depr {
    type: SquareType;
    piece: Piece_Depr;
    location: Location_Depr;

    /**
     * A square on the board! 
     * It has a location and can also have a piece on it.
     * 
     * @param type the type of the square. Is it only reserved for blue/red pieces?
     * @param piece the piece that is inside of the square.
     * @param location the location of this square in the board.
     */
    constructor(type: SquareType, piece: Piece_Depr, location: Location_Depr) {
        this.type = type;
        this.piece = piece;
        this.location = location;
    }

    /**
     * Serializes the Square into an plain object.
     * @returns plain object, representing this instance
     */
    serialize(): SerializedSquare {
        return {
            type: this.type,
            piece: this.piece,
            location: this.location
        };
    }
}

export class SquareUtils {
    /**
     * Check if a square has a piece.
     * Returns true when the square has piece in it, otherwise false.
     * 
     * @param {Square_Depr} square the square you want to check.
     * @returns {boolean} true when the square has piece in it, otherwise false.
     */
    static hasPiece(square: Square_Depr): boolean {
        if (isEmpty(square)) return false;
        return !isEmpty(square.piece);
    }


    /**
     * Returns the direction where the laser is currently pointing, based on it's orientation
     * 
     * @param piece the laser piece of which we want to get the direction from.
     * @returns the laser beam direction
     */
    static getLaserBeamDirection(piece: Piece_Depr): LaserDirection | null {
        // Invalid piece. Must be a laser piece.
        if (piece.type !== 'l') {
            return null;
        }

        const orientation = piece.orientation;
        switch (orientation) {
            case 0:
                return 'top';

            case 90:
                return 'right';

            case 180:
                return 'bottom';

            case 270:
                return 'left';
        }
    }
}