import type { CellGrid } from "@/models/cell";
import type { PlayerType } from "@/types";
import { Node } from "./node";
import { maxBy, minBy } from "lodash";
import type { Movement } from "@/models/movement";

export class AI {
    maxEvaluations: number;
    minDepth: number;

    constructor() {
        this.maxEvaluations = 1000;
        this.minDepth = 2;
    }

    /**
     * Return the next movement for the given color, based on the board state given
     * 
     * @param cellGrid the current state of the board.
     * @param playerType the player of whom you want the movement for
     * 
     * @returns {Movement} the best possible movement for this player
     */
    computeMove(cellGrid: CellGrid, playerType: PlayerType): Movement {
        let evaluations = 0; // number of evaluations made
        const rootNode = new Node(playerType, cellGrid, playerType);
        evaluations += rootNode.expand();

        // Interatively expand the tree levels, till the limit is reached.
        // Expands the least promissing leaf of the most promising path.
        while (evaluations < this.maxEvaluations) {
            const leaf = rootNode.getMinimumLeaf(playerType);
            if (leaf.score === -1000) {
                // We lost the game (min leaf == lose then we lost)
                break;
            }
            evaluations += leaf.expand();
            leaf.updateScore(playerType);
        }

        if (playerType === 'player-one') {
            return maxBy(rootNode.children, (childNode) => childNode.score).movement;
        } else {
            return minBy(rootNode.children, (childNode) => childNode.score).movement;
        }
    }
}