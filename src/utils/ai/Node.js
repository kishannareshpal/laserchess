import { maxBy, minBy } from "lodash";
import { PlayerTypesEnum } from "../../models/Enums";
import Board from "../../models/Board";

class Node {
    /**
     * Represent a node for the maximizing and minimizing player states.
     * 
     * @param {PlayerTypesEnum} biasPlayer the color whose move we're trying to compute originally
     * @param {Board} board the resulting board of the move
     * @param {Movement} move the move made that resulted on the board of this node
     * @param {PlayerTypesEnum} player the color that moved to achieve this board
     * @param {Node} parent // when this is a children node, keep the reference of the parent that originated this node as one of it's children.
     */
    constructor(biasPlayer, board, player, move = null, parentNode = null) {
        this.self = this;
        this.biasPlayer = biasPlayer;
        this.board = board;
        this.player = player;
        this.move = move;
        this.parentNode = parentNode; // ! from = null

        this.redPlayerScore = board.getPlayerScore(PlayerTypesEnum.RED); // evaluated a score for the red player only
        this.bluePlayerScore = board.getPlayerScore(PlayerTypesEnum.BLUE); // evaluated score for the blue player only
        this.score = this.bluePlayerScore; - this.redPlayerScore; // the node evaluated score
        this.movements = board.getMovesForPlayer(player); // possible moves for all pieces of this color
        this.children = []; // holds all of the expanded nodes (leafs - or in other words, Possible plays based on the board of this node)
    }


    /**
     * Expands this node!
     * 
     * @returns {number} the length of available movements of current node
     */
    expand() {
        const opponent_player = (this.player === PlayerTypesEnum.RED) ? PlayerTypesEnum.BLUE : PlayerTypesEnum.RED;
        this.children = []; // clear any previous children of this node.

        this.movements.forEach(movement => {
            const newBoard = this.board.newBoardFromMovement(movement, this.player);
            const childrenNode = new Node(this.biasPlayer, newBoard, opponent_player, movement, this.self);
            this.children.push(childrenNode);
        });

        // Return the length of the movements
        return this.movements.length;
    }


    /**
     * Sets a new score value for self based on children, then updates it's parent node
     * 
     * Used Formula:
     *      - score = red_score - silver_score if no children
     *      else
     *      - score = min(children.score)
     * 
     * @param {*} player 
     */
    updateScore(player) {

        if (this.children.length) {
            // If there are any children on this node
            // bias = 0  # Add small bias for directions that have better probabilistic outcomes
            // if self.parent is not None:
            //     parent_base = self.parent.red_score - self.parent.silver_score
            //     scores = [x.score for x in self.children]
            //     if self.bias_color is TeamColor.red and all(i >= parent_base for i in scores):
            //         bias = (.5 * len([1 for i in scores if i > parent_base])) / len(scores)

            //     elif self.bias_color is TeamColor.silver and all(i <= parent_base for i in scores):
            //         bias = (.5 * len([1 for i in scores if i < parent_base])) / len(scores)
            let bias = 0; // A small bias for directions that have better probabilistic outcomes
            if (this.parentNode) {
                const parentBaseScore = this.parentNode.score;
                const scores = this.children.map((childNode) => childNode.score);

                if ((this.biasPlayer === PlayerTypesEnum.BLUE) && (scores.every(score => score >= parentBaseScore))) {
                    const s = [];
                    scores.forEach(score => {
                        if (score > parentBaseScore) {
                            s.push(1);
                        }
                    });

                    bias = (0.5 * s.length) / scores.length;

                } else if ((this.biasPlayer === PlayerTypesEnum.RED) && (scores.every(score => score <= parentBaseScore))) {
                    const s = [];
                    scores.forEach(score => {
                        if (score < parentBaseScore) {
                            s.push(1);
                        }
                    });

                    bias = (0.5 * s.length) / scores.length;
                }
            }


            if (this.player === player) {
                if (player === PlayerTypesEnum.BLUE) {
                    // Blue player, maximizes
                    this.score = maxBy(this.children, (childNode) => childNode.score).score + bias;
                } else {
                    // Red player, minimizes
                    this.score = minBy(this.children, (childNode) => childNode.score).score - bias;
                }

            } else {
                if (player === PlayerTypesEnum.RED) {
                    // Red player, maximizes
                    this.score = maxBy(this.children, (childNode) => childNode.score).score + bias;
                } else {
                    // Blue player, minimizes
                    this.score = minBy(this.children, (childNode) => childNode.score).score - bias;
                }
            }
        }

        if (this.parentNode) {
            this.parentNode.updateScore(player);
        }
    }


    /**
     * 
     * @param {PlayerTypesEnum} player The color that we want to maximize the minimum of
     */
    getMinimumLeaf(player) {
        // base case
        if (this.children.length === 0) {
            return this.self;
        }

        // - When player is BLUE, "high" is the most positive score of all children.
        // - When the player is RED, "high" is most negative score of all children.
        if (this.player === player) {
            // choose the node with the highest score (this is a move that we get to pick)
            let nodeWithHighestScore;

            if (player === PlayerTypesEnum.BLUE) {
                nodeWithHighestScore = maxBy(this.children, (childNode) => childNode.score);
            } else {
                nodeWithHighestScore = minBy(this.children, (childNode) => childNode.score);
            }
            return nodeWithHighestScore.getMinimumLeaf(player);

        } else {
            // choose the node with the LOWEST score (this is a move that don't get to pick)
            let nodeWithLowestScore;

            if (player === PlayerTypesEnum.BLUE) {
                nodeWithLowestScore = minBy(this.children, (childNode) => childNode.score);
            } else {
                nodeWithLowestScore = maxBy(this.children, (childNode) => childNode.score);
            }
            return nodeWithLowestScore.getMinimumLeaf(player);
        }
    }

}

export default Node;