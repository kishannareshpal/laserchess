class Node {

    constructor(biasColor, board, color, move = null, parent = null) {
        this.move = move;
        this.biasColor = biasColor;
        this.board = board;
        this.redPlayerScore = 
    }

}




class Solver {
    constructor() {
        this.maxEvaluations = 1000;
        this.minDepth = 2;
    }


    /**
     * Return the next move for the given color, based on the board state given
     * 
     * @param {array} board the current state of the board.
     * @param {string|PlayerTypesEnum} color the color of the player you want the move for. Use {@see PlayerTypesEnum}
     */
    getMove(board, color) {

        const evaluations = 0; // number of evaluations made
        root = Node(color, board, color);
    }

}