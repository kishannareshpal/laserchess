
/**
 * Lookup object of individual piece scores.
 */
const PIECE_TO_SCORE = {
    d: 4, // Defender
    b: 2, // Deflector
    k: 60, // King
    s: 0, // Switch
    l: 0 // Laser
};

class AIUtils {
    /**
     * Evaluate a score based on the current board state, for a given player.
     * 
     * @param {Array} board the current board state
     * @param {string|PlayerTypesEnum} playerType the player of whom we want to evaluate the score. {@see PlayerTypesEnum}
     */
    static getPlayerScore(board, playerType) {
        // const playerSquares = 
    }

}

export default AIUtils;