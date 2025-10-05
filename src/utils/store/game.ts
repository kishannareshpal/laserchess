import type { CellGrid } from "@/models/models/cell";
import type { GameStatus, PlayerType } from "@/types";
import { observable } from "@legendapp/state";
import { SN } from "../SN";
import type { Location } from "@/models/models/location";
import { LocationHelper } from "@/models/helpers/location-helper";
import type { Movement } from "@/models/models/movement";
import { MovementHelper } from "@/models/helpers/movement-helper";
import type { LaserPath } from "@/models/models/laser";
import { LaserHelper } from "@/models/helpers/laser-helper";
import { CellHelper } from "@/models/helpers/cell-helper";

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

    turn: {
        phase: 'moving' | 'firing',
        player: PlayerType,
        selectedPieceLocation: Location | null,
        laserPath: LaserPath,
    }

    ai: {
        enabled: boolean,
        movement: unknown[]
    },
};

type GameStoreActions = {
    setupBoard: () => void,
    recordTurnMovement: (movment: Movement) => void,
    finishTurn: () => void,
    togglePieceAt: (location: Location, options?: { forcedState?: boolean }) => void,
    pause: () => void,
    resume: () => void,
}

type GameStore = GameStoreState & GameStoreActions;

const initialState: GameStoreState = {
    board: {
        setupNotation: DEFAULT_BOARD_SN,
        cellGrid: SN.parse(DEFAULT_BOARD_SN),
    },

    // currentPlayer: 'blue',
    status: 'playing',
    winner: null,

    turn: {
        phase: 'moving',
        player: 'blue',
        selectedPieceLocation: null,
        laserPath: []
    },

    ai: {
        enabled: false,
        movement: []
    },
};

export const game$ = observable<GameStore>({
    ...initialState,

    setupBoard: () => {
        game$.board.set({
            setupNotation: DEFAULT_BOARD_SN,
            cellGrid: SN.parse(DEFAULT_BOARD_SN)
        })
    },

    recordTurnMovement: (movement) => {
        // Ensure a move is allowed to be recorded
        if (game$.turn.phase.peek() !== 'moving') {
            return;
        }

        game$.togglePieceAt(movement.sourceCellLocation, { forcedState: false });

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

            const nextOrientation = MovementHelper.getNextOrientation(
                targetPiece.orientation.peek(),
                movement.type === 'clockwise_rotation' ? 'clockwise' : 'anticlockwise'
            )
            targetPiece.orientation.set(nextOrientation);
        }

        // Fire the laser
        const laserPath = LaserHelper.computeLaserPath(game$.turn.player.peek(), game$.board.cellGrid.peek());
        game$.turn.assign({
            phase: 'firing',
            laserPath: laserPath
        })
    },

    finishTurn: () => {
        const turn = game$.turn.get();
        if (turn.phase !== 'firing') {
            return;
        }

        // Handle the laser effect on the cell it landed on and finish the current player's turn
        const lastLaserSegment = turn.laserPath[turn.laserPath.length - 1];
        if (!lastLaserSegment) {
            return;
        }

        let isGameOver: boolean = false;
        if (lastLaserSegment.effect === 'kill') {
            // Remove a piece off the board
            const killedCell = CellHelper.getCellAt(game$.board.cellGrid.peek(), lastLaserSegment.location);
            if (!killedCell || !CellHelper.hasPiece(killedCell)) {
                // no piece in the killed cell for some reason - ignore
                return;
            }

            // Remove the killed piece from the cell in the grid
            game$.board.cellGrid[lastLaserSegment.location.rowIndex][lastLaserSegment.location.colIndex].piece.set(null);

            if (killedCell.piece.type === 'k') {
                // Game over: Killed a king piece - the player whose king got killed loses
                const winner = killedCell.piece.playerType === 'blue' ? 'red' : 'blue';
                game$.assign({
                    status: 'over',
                    winner: winner
                })

                isGameOver = true;
            }
        }

        if (!isGameOver) {
            // Next player's turn
            const nextPlayer: PlayerType = game$.turn.player.peek() === 'blue' ? 'red' : 'blue';
            game$.turn.set({
                phase: 'moving',
                player: nextPlayer,
                laserPath: [],
                selectedPieceLocation: null
            })
        }
    },

    togglePieceAt: (location, options) => {
        const currentlySelectedPieceLocation = game$.turn.selectedPieceLocation.peek();

        const shouldSelect = options?.forcedState
            || !currentlySelectedPieceLocation
            || !LocationHelper.equals(location, currentlySelectedPieceLocation);

        if (shouldSelect) {
            game$.turn.selectedPieceLocation.set(location);
        } else {
            // The same piece was clicked again -> deselect
            game$.turn.selectedPieceLocation.set(null);
        }
    },

    pause: () => {
        game$.status.set('paused');
    },

    resume: () => {
        game$.status.set('playing');
    }
});