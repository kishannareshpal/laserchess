/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Board } from "@/models/Board";
import type { CellGrid } from "@/models/models/cell";
import type { GameStatus, LaserActionType, PlayerType } from "@/types";
import { observable } from "@legendapp/state";
import { SN } from "../SN";
import type { Location } from "@/models/models/location";
import { LocationHelper } from "@/models/helpers/location-helper";
import type { Movement } from "@/models/models/movement";
import { MovementHelper } from "@/models/helpers/movement-helper";

/** 
 * The default board setup (ACE).
 * TODO: Make it dynamic, so the player can choose between different board setups.
 * ? In future, consider allowing the user to create their own board setup!
 * @constant {string}
 * @default
 */
const DEFAULT_BOARD_SN: string = "l++3d++kd++b+++2/2b7/3B+6/b++1B1ss+1b+++1B+/b+++1B+1S+S1b++1B/6b+++3/7B++2/2B+DKD3L";

type GameStoreState = {
    status: GameStatus

    board: {
        setupNotation: string,
        cellGrid: CellGrid,
    },

    winner: PlayerType
    currentPlayer: PlayerType,
    selectedPieceLocation: Location | null,
    movementIsLocked: boolean,

    ai: {
        enabled: boolean,
        movement: any[]
    },

    laser: {
        route: any[],
        finalLocation: Location | null,
        finalActionType: LaserActionType | null
    }
};

type GameStoreActions = {
    setupBoard: () => void,
    recordMovement: (movment: Movement) => void,
    finishMovement: () => void,
    togglePieceAt: (location: Location) => void,
    pause: () => void,
    resume: () => void,
}

type GameStore = GameStoreState & GameStoreActions;

const initialState: GameStoreState = {
    board: {
        setupNotation: DEFAULT_BOARD_SN,
        cellGrid: SN.parse(DEFAULT_BOARD_SN),
    },

    currentPlayer: 'blue',
    status: 'playing',
    winner: null,

    selectedPieceLocation: null,
    movementIsLocked: false,

    ai: {
        enabled: false,
        movement: []
    },

    laser: {
        route: [],
        finalLocation: null,
        finalActionType: null
    }
};

export const game$ = observable<GameStore>({
    ...initialState,

    setupBoard: () => {
        game$.board.set({
            setupNotation: DEFAULT_BOARD_SN,
            cellGrid: SN.parse(DEFAULT_BOARD_SN)
        })
    },

    recordMovement: (movement) => {
        if (movement.type === 'invalid') {
            return;
        }

        if (movement.type === 'normal' || movement.type === 'special') {
            // Swap source and target pieces (on a normal move, the target piece is empty/null, so the source will become empty/null)
            const sourcePiece = game$.board.cellGrid[movement.sourceCellLocation.rowIndex][movement.sourceCellLocation.colIndex].piece.peek();
            const targetPiece = game$.board.cellGrid[movement.targetCellLocation.rowIndex][movement.targetCellLocation.colIndex].piece.peek();

            game$.board.cellGrid[movement.sourceCellLocation.rowIndex][movement.sourceCellLocation.colIndex]
                .assign({
                    piece: targetPiece,
                    // location: movement.targetCellLocation
                });

            game$.board.cellGrid[movement.targetCellLocation.rowIndex][movement.targetCellLocation.colIndex]
                .assign({
                    piece: sourcePiece,
                    // location: movement.sourceCellLocation
                });

        } else if (movement.type === 'clockwise_rotation' || movement.type === 'anticlockwise_rotation') {
            // Rotate the target piece clockwise or anti-clockwise (which should always be assumed to be the same as source piece in this case, but we use the target piece for correctness)
            const targetPiece = game$.board.cellGrid[movement.targetCellLocation.colIndex][movement.targetCellLocation.rowIndex].piece;
            if (!targetPiece) {
                return;
            }

            const nextOrientation = MovementHelper.getNetOrientation(
                targetPiece.orientation.peek(),
                movement.type === 'clockwise_rotation' ? 'clockwise' : 'anticlockwise'
            )
            targetPiece.orientation.set(nextOrientation);
        }

        // game$.movementIsLocked.set(true);
        // Lock the move until finished (or laser stopped)
        // const { movement } = action.payload;
        // const newBoard = new Board(/* { squares: game$.squares.get() } */);

        // newBoard.applyMovement(movement);
        // const route = newBoard.getLaserRoute(game$.currentPlayer.get());

        // const lastLaserRoutePath = route[route.length - 1];
        // game$.laser.assign({
        //     route: route,
        //     finalActionType: lastLaserRoutePath.actionType,
        //     finalLocation: lastLaserRoutePath.location
        // })

        // if (state.ai.movement) {
        //     state.ai.movement = null; // resets the ai movement
        // }
    },

    finishMovement: () => {
        // const newBoard = new Board(/* { squares: game$.squares.get() } */);
        // newBoard.applyLaser(game$.currentPlayer.get());
        // const serializedBoard = newBoard.serialize();

        // state.winner = serializedBoard.winner;
        // state.sn = serializedBoard.sn;
        // state.squares = serializedBoard.squares;

        // // Check if game over
        // if (serializedBoard.winner) {
        //     // If game is over, then keep the movement locked and show who won in the UI.
        //     state.movementIsLocked = true;
        //     state.status = GameStatusEnum.GAME_OVER;

        // } else {
        //     // reset laser
        //     state.laser.route = [];
        //     state.laser.finalActionType = null;
        //     state.laser.finalLocation = null;

        //     // If game is not over, then pass the turn to the next player
        //     state.currentPlayer = (state.currentPlayer === PlayerTypesEnum.BLUE) ? PlayerTypesEnum.RED : PlayerTypesEnum.BLUE;
        //     state.movementIsLocked = false; // unlock the movement for the next player.
        // }
    },

    togglePieceAt: (location) => {
        const currentlySelectedPieceLocation = game$.selectedPieceLocation.peek();

        if (currentlySelectedPieceLocation && LocationHelper.equals(location, currentlySelectedPieceLocation)) {
            game$.selectedPieceLocation.set(null);
        } else {
            game$.selectedPieceLocation.set(location);
        }
    },

    pause: () => {
        game$.status.set('paused');
    },

    resume: () => {
        game$.status.set('playing');
    }
});