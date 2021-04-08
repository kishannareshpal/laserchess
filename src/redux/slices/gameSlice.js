import { createSlice } from "@reduxjs/toolkit";
import { PlayerTypesEnum, GameStatusEnum } from "../../models/Enums";
import Board from "../../models/Board";
import AI from "../../utils/ai/AI";

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
        currentPlayer: PlayerTypesEnum.BLUE, // The current player
        status: GameStatusEnum.PLAYING,
        winner: "", // 🎉 this is replaced with either PlayerTypesEnum.BLUE or PlayerTypesEnum.RED when one of them wins by killing the opponent's king!
        squares: [],

        selectedPieceLocation: null, // keeps track of the location where the selected piece is. It is NULL when no piece is selected.
        movementIsLocked: false, // when true, no player can move any piece. Usually becomes true when the laser is triggered and changing to another piece

        ai: {
            enabled: true, // is ai mode enabled?
            movement: null // the ai movement to be made
        },

        laser: {
            route: [],
            finalLocation: null,
            finalActionType: null
        }
    },
    reducers: {
        /**
         * Setup the board with a setup notation
         * This should be called in the app initialization.
         * 
         * @param {Object} action
         * @param {Object} action.payload
         * @param {string} action.payload.setupNotation the initial board setup notation.
         *                                              - If setupNotation is not passed, will default to the Ace board
         */
        setBoardType: (state, action) => {
            const newBoard = new Board(action.payload).serialize();
            state.squares = newBoard.squares;
            state.winner = newBoard.winner;
            state.sn = newBoard.sn;
        },

        /**
         * Perform a movement on the current board state.
         * @param {Object} action
         * @param {Object} action.payload
         * @param {Movement} action.payload.movement the movement to be performed on the board.
         */
        applyMovement: (state, action) => {
            state.movementIsLocked = true;

            // Lock the move until finished (or laser stopped)
            const { movement } = action.payload;
            const newBoard = new Board({ squares: state.squares });

            newBoard.applyMovement(movement);
            const route = newBoard.getLaserRoute(state.currentPlayer);

            state.laser.triggered = true;
            state.laser.route = route;

            const lastLaserRoutePath = route[route.length - 1];
            state.laser.finalActionType = lastLaserRoutePath.actionType;
            state.laser.finalLocation = lastLaserRoutePath.location;

            if (state.ai.movement) {
                state.ai.movement = null; // resets the ai movement
            }
        },


        /**
         * Compute the next move for the AI based on current board state.
         * Sets the serialized computed movement to state.movement
         */
        computeAIMovement: (state) => {
            const newBoard = new Board({ squares: state.squares });

            // Using minimax determine the optimal move for the ai.
            const ai = new AI();
            const movement = ai.computeMove(newBoard, PlayerTypesEnum.RED);
            state.ai.movement = movement.serialize();
            state.movementIsLocked = true;
        },


        /**
         * 
         * @param {*} state 
         */
        toggleAI: (state) => {
            state.ai.enabled = !state.ai.enabled;
        },

        /**
         * Finishes the current player move.
         * Hides the laser and applies any laser effect to the board (such as removing a piece on hit)
         *  - if game over, lock the movement.
         *  - // todo: if not game over, passes the turn to the next player. by removing the #togglePlayerTurn()
         * - This action is dispatched before #togglePlayerTurn.
         */
        finishMovement: (state) => {
            const newBoard = new Board({ squares: state.squares });
            newBoard.applyLaser(state.currentPlayer);
            const serializedBoard = newBoard.serialize();

            state.winner = serializedBoard.winner;
            state.sn = serializedBoard.sn;
            state.squares = serializedBoard.squares;

            // Check if game over
            if (serializedBoard.winner) {
                // If game is over, then keep the movement locked and show who won in the UI.
                state.movementIsLocked = true;
                state.status = GameStatusEnum.GAME_OVER;

            } else {
                // reset laser
                state.laser.route = [];
                state.laser.finalActionType = null;
                state.laser.finalLocation = null;

                // If game is not over, then pass the turn to the next player
                state.currentPlayer = (state.currentPlayer === PlayerTypesEnum.BLUE) ? PlayerTypesEnum.RED : PlayerTypesEnum.BLUE;
                state.movementIsLocked = false; // unlock the movement for the next player.
            }

        },


        /**
         * Mark a square location, selected or not.
         * 
         * @param {Object} action
         * @param {Object} action.payload
         * @param {Location} action.payload.location The location of the piece to be selected. 
         * 
         * You can pass NULL to unselect (if selected) the currently selected piece,
         * or even better, use the #uselectPiece action.
         */
        selectPiece: (state, action) => {
            const { location } = action.payload;
            state.selectedPieceLocation = location;
        },

        /**
         * Unselect a piece
         * 
         * @see selectPiece on how to select a piece by it's location.
         */
        unselectPiece: (state) => {
            state.selectedPieceLocation = null;
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
    togglePlayerTurn,
    finishMovement,
    pause,
    resume,
    setBoardType,
    applyMovement,
    computeAIMovement,
    toggleAI,
    selectPiece,
    unselectPiece,
} = gameSlice.actions;


// Selectors, to allow us to easily select a value from the state, while 
// export const selectAllSquares = state => state.squares;



export default gameSlice.reducer;
