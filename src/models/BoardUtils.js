import { isArray, flatMap } from "lodash";
import { SquareUtils } from "./Square";


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


    static getSquaresOfColor(board, color) {
        if (isArray(board)) {
            // flatten all rows into a single array
            // console.log(board);
            const flattened = flatMap(board);
            const squares = flattened.filter((square) => {
                // Filter out the squares with no pieces in it.
                // Because we are not drawing empty squares on the board (obviously!)
                return SquareUtils.hasPiece(square) && square.piece.color === color;
            });
            return squares;
        }
        return null;
    }

}


export default BoardUtils;