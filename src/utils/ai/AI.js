import { maxBy, minBy } from "lodash";
import { PlayerTypesEnum } from "../../models/Enums";
import Board from "../../models/Board";
import Node from "./Node";


class AI {
    constructor() {
        this.maxEvaluations = 1000;
        this.minDepth = 2;
    }

    /**
     * Return the next movement for the given color, based on the board state given
     * 
     * @param {Board} board the current state of the board.
     * @param {PlayerTypesEnum} player the player of whom you want the movement for
     * 
     * @returns {Movement} the best possible movement for this player
     */
    computeMove(board, player) {
        let evaluations = 0; // number of evaluations made
        const rootNode = new Node(player, board, player);
        evaluations += rootNode.expand();

        // Interatively expand the tree levels, till the limit is reached.
        // Expands the least promissing leaf of the most promising path.
        while (evaluations < this.maxEvaluations) {
            const leaf = rootNode.getMinimumLeaf(player);
            if (leaf.score === -1000) {
                // We lost the game (min leaf == lose then we lost)
                break;
            }
            evaluations += leaf.expand();
            leaf.updateScore(player);
        }

        if (player === PlayerTypesEnum.BLUE) {
            return maxBy(rootNode.children, (childNode) => childNode.score).move;
        } else {
            return minBy(rootNode.children, (childNode) => childNode.score).move;
        }
    }
}

export default AI;