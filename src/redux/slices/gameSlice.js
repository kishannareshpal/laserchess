import { createSlice } from "@reduxjs/toolkit";
import SN from "../../utils/SN";
import { PieceUtils } from "../../models/Piece";
import BoardUtils from "../../models/BoardUtils";
import { PlayerTypesEnum, MovementTypesEnum, LaserHitActionTypesEnum, GameStatusEnum, PieceTypesEnum } from "../../models/Enums";
import Engine from "../../utils/Engine";

/** 
 * The default board setup (ACE).
 * TODO: Make it dynamic, so the player can choose between different board setups.
 * ? In future, consider allowing the user to create their own board setup!
 * @constant {string}
 * @default
 */
const DEFAULT_BOARD_SN = "l++3d++kd++b+++2/2b7/3B+6/b++1B1ss+1b+++1B+/b+++1B+1S+S1b++1B/6b+++3/7B++2/2B+DKD3L";

const gameSlice = createSlice({
    name: "game",
    initialState: {
        sn: DEFAULT_BOARD_SN, // setup notation
        turn: PlayerTypesEnum.BLUE, // The side to move. The blue player always plays first. See rules.
        laserIsTriggered: false, // after each move, becomes true for short-time, and then false again.
        laserBeamPath: [],
        status: GameStatusEnum.PLAYING,
        winner: "", // 🎉 this is replaced with either PlayerTypesEnum.BLUE or PlayerTypesEnum.RED when one of them wins by killing the opponent's king!
        board: []
    },
    reducers: {
        /**
         * Initialize the board by setting up the pieces on it's initial positions.
         * This should be called once in the game initialization code (when page loads / onComponentDidMount - useEffect(,[]))
         * 
         * @param {SN} action.payload.sn Setup Notation of the initial pieces positions.
         */
        init: (state, action) => {
            if (action.payload) {
                // Get the custom starting setup notation (sn)
                const startingSN = action.payload.sn;
                state.sn = startingSN;
                state.board = SN.parse(startingSN);

            } else {
                // Use the default board sn as starter.
                state.board = SN.parse(state.sn);
            }
        },

        /**
         * Toggle the player turn. If red, toggle to blue and vice versa.
         * 
         */
        togglePlayerTurn: (state) => {
            state.turn = (state.turn === PlayerTypesEnum.BLUE) ? PlayerTypesEnum.RED : PlayerTypesEnum.BLUE;
        },

        /**
         * Perform the movement on the current board and return the new board with the move made.
         * 
         * @param {Movement} action.payload.movement the movement that is being performed.
         */
        move: (state, action) => {
            const board = state.board;
            const { movement } = action.payload;
            const squareAtSrc = BoardUtils.getSquareAtLocation(board, movement.srcLocation);

            // Check what type of move is being performed
            if (movement.type === MovementTypesEnum.NORMAL) {
                // Normal movement (from one square to an empty one)
                const squareAtDest = board[movement.destLocation.rowIndex][movement.destLocation.colIndex];
                // const squareAtDest = BoardUtils.getSquareAtLocation(board, movement.srcLocation);

                // Move the piece from the src to dest.
                squareAtDest.piece = squareAtSrc.piece;
                squareAtSrc.piece = null;

            } else if (movement.type === MovementTypesEnum.ROTATION_CLOCKWISE) {
                // Rotation movement (clockwise)
                const clockwise = true;
                PieceUtils.applyRotation(squareAtSrc.piece, clockwise);

            } else if (movement.type === MovementTypesEnum.ROTATION_C_CLOCKWISE) {
                // Rotation movement (counter-clockwise)
                const c_clockwise = false;
                PieceUtils.applyRotation(squareAtSrc.piece, c_clockwise);

            } else if (movement.type === MovementTypesEnum.SPECIAL) {
                // Special movement (Switch piece is swapping places with either a Deflector or Defender piece)
                const squareAtDest = BoardUtils.getSquareAtLocation(board, movement.destLocation);

                // Swap the pieces.
                const squareAtSrcPiece = squareAtSrc.piece;
                squareAtSrc.piece = squareAtDest.piece;
                squareAtDest.piece = squareAtSrcPiece;
            }


            // Now compute the new laser beam path so we can turn it on
            const { lastHitType, lastHitLocation, path } = Engine.computeLaserPath(board, state.turn);
            // and finally handle the laser hit
            if (lastHitType === LaserHitActionTypesEnum.KILL) {
                const squareAtHit = board[lastHitLocation.rowIndex][lastHitLocation.colIndex];
                // Check if we killed the King!
                if (squareAtHit.piece.type === PieceTypesEnum.KING) {
                    // Oh lord, the king is dead, I repeat, the king is dead!
                    // Check which king is dead and declare the winner! 🏴‍☠️ 
                    const winnerPlayerColor = squareAtHit.piece.color === PlayerTypesEnum.BLUE ? PlayerTypesEnum.RED : PlayerTypesEnum.BLUE;
                    state.winner = winnerPlayerColor;
                    state.status = GameStatusEnum.FINISHED;

                } else {
                    // If we hit any piece, other than a King
                    // Remove the piece from the square.
                    squareAtHit.piece = null;
                }
            }
            // Trigger the laser (this laser is then hidden after a short period of time when shown)
            state.laserBeamPath = path;
            state.laserIsTriggered = true;
        },


        /**
         * Hide the laser beam.
         * - This action is always called after/before #togglePlayerTurn.
         */
        hideLaserBeam: (state) => {
            state.laserBeamPath = [];
            state.laserIsTriggered = false;
        },


        // Control game state
        /**
         * Pause the game!
         */
        pause: (state) => {
            state.status = GameStatusEnum.PAUSED;
        },

        /**
         * Resume the game. 
         */
        resume: (state) => {
            state.status = GameStatusEnum.PLAYING;
        }


    }

});

// Action creators are generated for each case reducer function
export const {
    init,
    togglePlayerTurn,
    hideLaserBeam,
    move,
    pause,
    resume
} = gameSlice.actions;

export default gameSlice.reducer;
