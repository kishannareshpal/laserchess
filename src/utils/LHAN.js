import { LaserHitActionTypesEnum } from "../models/Enums";
import LHAN_RELATIONS_JSON from "../assets/laser-v-piece.json";

/**
 * Laser Hit Action Notation
 * represents the action taken by the laser when it hits a particular piece at any given orientation
 */
class LHAN {

    /**
     * Get the laser beam hit action on the piece from the current direction.
     * 
     * @param {LaserBeamDirectionsEnum} currentDirection The direction from where the laser beam is coming to hit the piece. 
     * @param {Piece} piece The piece you want the hit action of from the currentDirection.
     * 
     * @returns {object} { actionType: LaserHitActionTypesEnum, newDirection LaserBeamDirectionsEnum | null }
     */
    static getHitAction(currentDirection, piece) {
        const orientation = piece.orientation;
        const type = piece.type;
        const hitAction = LHAN_RELATIONS_JSON[currentDirection][type][orientation];

        if (hitAction === "kill" || hitAction === "nothing") {
            return {
                type: hitAction,
                newDirection: null
            };
        } else {
            return {
                type: LaserHitActionTypesEnum.DEFLECT,
                newDirection: hitAction
            };
        }
    }
}

export default LHAN;