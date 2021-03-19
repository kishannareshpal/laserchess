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
}

export default Movement;
export { MovementUtils };