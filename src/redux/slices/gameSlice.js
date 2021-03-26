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
        turn: PlayerTypesEnum.BLUE, // The side to move. The blue player always plays first. See rules.
        laserIsTriggered: false, // after each move, becomes true for short-time, and then false again.
        laserBeamPath: [],
        status: GameStatusEnum.PLAYING,
        winner: "", // 🎉 this is replaced with either PlayerTypesEnum.BLUE or PlayerTypesEnum.RED when one of them wins by killing the opponent's king!
        squares: [],

        aiEnabled: true,

        laser: {
            triggered: false,
            path: []
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
         * @param {Movement} action.payload.movement the movement to be performed on the board.
         */
        playerMove: (state, action) => {
            const { movement } = action.payload;
            const newBoard = new Board({ squares: state.squares });
            newBoard.applyMovement(movement);
            const laserPath = newBoard.applyLaser(state.turn);

            const serializedBoard = newBoard.serialize();
            state.winner = serializedBoard.winner;
            state.sn = serializedBoard.sn;
            state.squares = serializedBoard.squares;

            state.laser.triggered = true;
            state.laser.path = laserPath;
        },


        /**
         * Think and perform a move as AI, using the Minimax algorithm
         */
        aiMove: (state) => {
            const newBoard = new Board({ squares: state.squares });

            // Using minimax, determine the best possible move for this player based on current state of the board
            const ai = new AI();
            const movement = ai.computeMove(newBoard, PlayerTypesEnum.RED);

            newBoard.applyMovement(movement);
            const laserPath = newBoard.applyLaser(PlayerTypesEnum.RED);
            const serializedBoard = newBoard.serialize();
            state.winner = serializedBoard.winner;
            state.sn = serializedBoard.sn;
            state.squares = serializedBoard.squares;

            state.laser.triggered = true;
            state.laser.path = laserPath;
        },


        /**
         * Toggle the player turn. If red, toggle to blue and vice versa.
         * 
         */
        togglePlayerTurn: (state) => {
            state.turn = (state.turn === PlayerTypesEnum.BLUE) ? PlayerTypesEnum.RED : PlayerTypesEnum.BLUE;
        },


        /**
         * 
         * @param {*} state 
         */
        toggleAI(state) {
            state.aiEnabled = !state.aiEnabled;
        },

        /**
         * Hide the laser beam.
         * - This action is always called after/before #togglePlayerTurn.
         */
        hideLaserBeam: (state) => {
            state.laser.path = [];
            state.laser.triggered = false;
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
    hideLaserBeam,
    pause,
    resume,
    setBoardType,
    playerMove,
    aiMove,
    toggleAI
} = gameSlice.actions;

export default gameSlice.reducer;
