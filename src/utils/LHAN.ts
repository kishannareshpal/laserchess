import LHAN_RELATIONS_JSON from "../assets/laser-v-piece.json";
import type { LaserActionType, LaserDirection } from "@/types";
import type { Piece_Depr } from "@/models/Piece";

/**
 * Laser Hit Action Notation
 * represents the action taken by the laser when it hits a particular piece at any given orientation
 */
class LHAN {

    /**
     * Get the laser beam hit action on the piece from the current direction.
     * 
     * @param currentDirection The direction from where the laser beam is coming to hit the piece. 
     * @param {Piece_Depr} piece The piece you want the hit action of from the currentDirection.
     * 
     * @returns {object} { actionType: LaserActionTypesEnum, newDirection LaserDirectionsEnum | null }
     */
    static getHitAction(currentDirection: LaserDirection, piece: Piece_Depr): { type: LaserActionType, newDirection: LaserDirection | null } {
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
                type: 'deflect',
                newDirection: hitAction as LaserDirection
            };
        }
    }
}

export default LHAN;