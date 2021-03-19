import { isArray } from "lodash";


class BoardUtils {
    /**
     * Get a square from the current board that is on the specified location.
     * 
     * @param {Board} board the current board.
     * @param {Location} location the location of the square on the board.
     * @returns {Square} the square or null if not found any square on the specified location.
     */
    static getSquareAtLocation(board, location) {
        if (isArray(board)) {
            let row = board[location.rowIndex];
            if (row) {
                let squareAtLocation = row[location.colIndex];
                return squareAtLocation;
            }
        }
        return null;
    }

}


export default BoardUtils;