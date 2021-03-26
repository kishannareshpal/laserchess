import { LocationUtils } from "./Location";
import { MovementTypesEnum } from "../models/Enums";


class Movement {
    /**
     * A class representing a movement following AN.
     * 
     * @param {string} type movement type. Use MovementTypesEnum
     * @param {Location} srcLocation the location from where the piece is being moved.
     * @param {Location} [destLocation] (optional) the location of the target square. Where the piece is being moved to.
     *                                  Can be null if movement type is rotation
     * 
     * @see MovementTypesEnum for movement type param
     */
    constructor(type, srcLocation, destLocation) {
        this.type = type;
        this.srcLocation = srcLocation;
        this.destLocation = destLocation;
    }

    /**
     * Check if the movement is possible, in other words, if it not of type #INVALID
     * @returns {boolean} true if possible, otherwise false
     */
    get isPossible() {
        return this.type !== MovementTypesEnum.INVALID;
    }

    /**
     * Serializes the Movement object into an Object.
     * @returns {Object} plain object, representing this instance
     */
    serialize() {
        return {
            type: this.type,
            srcLocation: this.srcLocation.serialize(),
            destLocation: this.destLocation ? this.destLocation.serialize() : null,
            isPossible: this.isPossible
        };
    }
}

class MovementUtils {
    /**
     * Transforms a movement into AN string.
     * 
     * @param {Movement} movement The movement to be transformed
     * @returns {string} The Algebraic notation of the move. 
     */
    static toANString(movement) {
        const srcAN = LocationUtils.toANString(movement.srcLocation);
        switch (type) {
            case MovementTypesEnum.NORMAL:
                return `${srcAN}${LocationUtils.toANString(movement.destLocation)}`; // e.g: j4j3

            case MovementTypesEnum.SPECIAL:
                return `${srcAN}u${LocationUtils.toANString(movement.destLocation)}`; // e.g: f4ug3

            case MovementTypesEnum.ROTATION_CLOCKWISE:
                return `${srcAN}${RotationTypesEnum.CLOCKWISE}`; // e.g: h2+

            case MovementTypesEnum.ROTATION_C_CLOCKWISE:
                return `${srcAN}${RotationTypesEnum.COUNTER_CLOCKWISE}`; // e.g: h2-
        }

        return null;
    }


    /**
     * Returns a new Movement object from the provided algebraic notation for movement.
     * @see AlgebraicNotation.md to learn more about the Algebraic Notation for this game
     * 
     * @param {string} algebraicNotation the algebraic notation text to transform into Movement
     */
    static parse(algebraicNotation) {
        if (algebraicNotation) {
            // First of all get the type of movement being performed.
            if (algebraicNotation.includes("u")) {
                // Special Move
                const [src, dest] = algebraicNotation.split("u");
                const srcLocation = LocationUtils.parse(src);
                const destLocation = LocationUtils.parse(dest);
                return new Movement(MovementTypesEnum.SPECIAL, srcLocation, destLocation);

            } else if (algebraicNotation.includes("+")) {
                // Clockwise rotation
                const [src] = algebraicNotation.split("+");
                const srcLocation = LocationUtils.parse(src);
                return new Movement(MovementTypesEnum.ROTATION_CLOCKWISE, srcLocation, null);

            } else if (algebraicNotation.includes("-")) {
                // Clockwise rotation
                const [src] = algebraicNotation.split("-");
                const srcLocation = LocationUtils.parse(src);
                return new Movement(MovementTypesEnum.ROTATION_C_CLOCKWISE, srcLocation, null);

            } else {
                // Normal move
                const src = algebraicNotation.slice(0, 2);
                const dest = algebraicNotation.slice(2, 4);
                const srcLocation = LocationUtils.parse(src);
                const destLocation = LocationUtils.parse(dest);
                return new Movement(MovementTypesEnum.NORMAL, srcLocation, destLocation);
            }
        } else {
            throw new Error(`Invalid algebraic notation: '${algebraicNotation}'`);
        }
    }
}

export default Movement;
export { MovementUtils };