import type { CellGrid } from "@/models/cell";
import { CellHelper } from "@/models/helpers/cell-helper";
import { MovementHelper } from "@/models/helpers/movement-helper";
import { PlayerHelper } from "@/models/helpers/player-helper";
import type { Movement } from "@/models/movement";
import type { PieceType, PlayerType } from "@/types";
import { maxBy, minBy } from "lodash";

/**
 * @constant
 * @type {Object}
 * 
 * Lookup object of individual piece scores.
 */
const SCORE_BY_PIECE_TYPE: Record<PieceType, number> = {
    d: 2, // Defender
    b: 1, // Deflector
    s: 0, // Switch
    l: 0, // Laser
    k: -1000, // King. We ignore adding king's score, because when the king is not present, a default of -1000 will be given and the game is already over.
};

export class Node {
    biasPlayer: PlayerType;
    cellGrid: CellGrid;
    player: PlayerType;
    movement: Movement;
    parent: Node;
    children: Node[];
    playerOneScore: number;
    playerTwoScore: number;
    score: number;
    movements: Movement[];

    constructor(
        biasPlayer: PlayerType,
        cellGrid: CellGrid,
        player: PlayerType,
        movement: Movement = null,
        parent: Node = null,
    ) {
        this.biasPlayer = biasPlayer;
        this.cellGrid = cellGrid;
        this.movement = movement;
        this.player = player;
        this.parent = parent;

        this.playerOneScore = this.determinePlayerScore('player-one', cellGrid);
        this.playerTwoScore = this.determinePlayerScore('player-two', cellGrid);
        this.score = this.playerOneScore - this.playerTwoScore;
        this.movements = this.getMovesForPlayer(player, cellGrid);
        this.children = [];
    }

    expand() {
        const opponentPlayer = PlayerHelper.opponentOf(this.player);
        this.children = []; // clear any previous children of this node.

        this.movements.forEach(movement => {
            const updatedCellGrid = MovementHelper.perform(movement, this.cellGrid);
            const childrenNode = new Node(this.biasPlayer, updatedCellGrid, opponentPlayer, movement, this);
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
         * @param playerType
         */
    updateScore(playerType: PlayerType): void {

        if (this.children.length) {
            // If there are any children on this node
            let bias = 0; // A small bias for directions that have better probabilistic outcomes
            if (this.parent) {
                const parentBaseScore = this.parent.score;
                const scores = this.children.map((childNode) => childNode.score);

                if ((this.biasPlayer === 'player-one') && (scores.every(score => score >= parentBaseScore))) {
                    const s = [];
                    scores.forEach(score => {
                        if (score > parentBaseScore) {
                            s.push(1);
                        }
                    });

                    bias = (0.5 * s.length) / scores.length;

                } else if ((this.biasPlayer === 'player-two') && (scores.every(score => score <= parentBaseScore))) {
                    const s = [];
                    scores.forEach(score => {
                        if (score < parentBaseScore) {
                            s.push(1);
                        }
                    });

                    bias = (0.5 * s.length) / scores.length;
                }
            }


            if (this.player === playerType) {
                if (playerType === 'player-one') {
                    // Blue player, maximizes
                    this.score = maxBy(this.children, (childNode) => childNode.score).score + bias;
                } else {
                    // Red player, minimizes
                    this.score = minBy(this.children, (childNode) => childNode.score).score - bias;
                }

            } else {
                if (playerType === 'player-two') {
                    // Red player, maximizes
                    this.score = maxBy(this.children, (childNode) => childNode.score).score + bias;
                } else {
                    // Blue player, minimizes
                    this.score = minBy(this.children, (childNode) => childNode.score).score - bias;
                }
            }
        }

        if (this.parent) {
            this.parent.updateScore(playerType);
        }
    }

    /**
     * 
     * @param playerType The color that we want to maximize the minimum of
     */
    getMinimumLeaf(playerType: PlayerType) {
        // base case
        if (this.children.length === 0) {
            return this;
        }

        // - When player is BLUE, "high" is the most positive score of all children.
        // - When the player is RED, "high" is most negative score of all children.
        if (this.player === playerType) {
            // choose the node with the highest score (this is a move that we get to pick)
            let nodeWithHighestScore: Node;

            if (playerType === 'player-one') {
                nodeWithHighestScore = maxBy(this.children, (childNode) => childNode.score);
            } else {
                nodeWithHighestScore = minBy(this.children, (childNode) => childNode.score);
            }
            return nodeWithHighestScore.getMinimumLeaf(playerType);

        } else {
            // choose the node with the LOWEST score (this is a move that don't get to pick)
            let nodeWithLowestScore: Node;

            if (playerType === 'player-one') {
                nodeWithLowestScore = minBy(this.children, (childNode) => childNode.score);
            } else {
                nodeWithLowestScore = maxBy(this.children, (childNode) => childNode.score);
            }
            return nodeWithLowestScore.getMinimumLeaf(playerType);
        }
    }


    /**
     * Evaluate a score based on the current board state and pieces available on it for the specified player.
     * @see PIECE_TO_SCORE for the weights of playable piece, used on the evaluation here.
     * 
     * @param playerType the player of whom we want to evaluate the score
     * @returns the score. If game over, return -100.
     */
    private determinePlayerScore(playerType: PlayerType, cellGrid: CellGrid): number {
        let score = 0;
        const cells = CellHelper.getPlayerCells(cellGrid, playerType);

        // Track the king, to make sure it is is on the board
        let isKingAvailable = false; // we will update this check bellow when we loop through all the pieces on the board

        /**
         * Loop through all of the pieces of this player, and compute the scores 
         * based on our lookup object above 
         * @see PIECE_TO_SCORE the lookup object constant
         */
        cells.forEach(cell => {
            if (cell.piece.type === 'k') {
                isKingAvailable = true;
            } else {
                score += SCORE_BY_PIECE_TYPE[cell.piece.type];
            }
        });

        // If the king piece of this color is not in the board.
        // then game over.
        if (!isKingAvailable) {
            return -1000;
        } else {
            return score;
        }
    }

    private getMovesForPlayer(playerType: PlayerType, cellGrid: CellGrid): Movement[] {
        const moves = [];

        const cells = CellHelper.getPlayerCells(cellGrid, playerType);

        cells.forEach(cell => {
            const movesForPiece = MovementHelper.getMovesForPieceAt(cell.location, cellGrid);
            if (movesForPiece.length !== 0) {
                // append if there are any moves available for said piece
                moves.push(...movesForPiece);
            }
        });

        return moves;
    }
}