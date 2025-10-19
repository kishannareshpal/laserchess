import type { CellGrid } from "@/models/cell";
import type { GameStatus, PlayerType } from "@/types";
import { event, observable } from "@legendapp/state";
import { SN } from "../sn";
import type { Location } from "@/models/location";
import { LocationHelper } from "@/models/helpers/location-helper";
import type { Movement } from "@/models/movement";
import { MovementHelper } from "@/models/helpers/movement-helper";
import type { LaserPath } from "@/models/laser";
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
    cellGrid: CellGrid,
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
    startGame: (reset?: boolean) => void,
    recordTurnMovement: (movment: Movement) => void,
    finishTurn: () => void,
    togglePieceAt: (location: Location, options?: { forcedState?: boolean }) => void,
    togglePause: (forcePause?: boolean) => void
}

type GameStore = GameStoreState & GameStoreActions;

const initialState: GameStoreState = {
    status: 'idle',
    cellGrid: [],
    winner: null,
    turn: {
        phase: 'moving',
        player: 'player-two',
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

    startGame: (reset = game$.status.peek() === 'idle') => {
        if (!reset) {
            return;
        }

        const newCellGrid = SN.parse(DEFAULT_BOARD_SN);
        game$.assign({
            status: 'playing',
            cellGrid: newCellGrid,
        });
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
            const sourceCell = structuredClone(game$.cellGrid[movement.sourceCellLocation.rowIndex][movement.sourceCellLocation.colIndex].peek());
            const targetCell = structuredClone(game$.cellGrid[movement.targetCellLocation.rowIndex][movement.targetCellLocation.colIndex].peek());

            game$.cellGrid[movement.sourceCellLocation.rowIndex][movement.sourceCellLocation.colIndex]
                .assign({
                    id: targetCell.id,
                    piece: targetCell.piece,
                    location: movement.sourceCellLocation
                });

            game$.cellGrid[movement.targetCellLocation.rowIndex][movement.targetCellLocation.colIndex]
                .assign({
                    id: sourceCell.id,
                    piece: sourceCell.piece,
                    location: movement.targetCellLocation
                });

        } else if (movement.type === 'clockwise_rotation' || movement.type === 'anticlockwise_rotation') {
            // Rotate the target piece clockwise or anti-clockwise (which should always be assumed to be the same as source piece in this case, but we use the target piece for correctness)
            const targetPiece = game$.cellGrid[movement.targetCellLocation.rowIndex][movement.targetCellLocation.colIndex].piece.peek();
            if (!targetPiece) {
                return;
            }

            const nextOrientation = MovementHelper.getNextOrientation(
                targetPiece.orientation,
                movement.type === 'clockwise_rotation' ? 'clockwise' : 'anticlockwise'
            )
            game$.cellGrid[movement.targetCellLocation.rowIndex][movement.targetCellLocation.colIndex].piece.orientation.set(nextOrientation);
        }

        // Fire the laser
        const cellGrid = game$.cellGrid.peek();
        const laserPath = LaserHelper.computeLaserPath(game$.turn.player.peek(), cellGrid);
        game$.turn.assign({
            phase: 'firing',
            laserPath: laserPath
        });

        // CellHelper.prettyPrintCellGrid(cellGrid)
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
            const killedCell = CellHelper.getCellAt(game$.cellGrid.peek(), lastLaserSegment.location);
            if (!killedCell || !CellHelper.hasPiece(killedCell)) {
                // no piece in the killed cell for some reason - ignore
                return;
            }

            if (killedCell.piece.type === 'k') {
                // Game over: Killed a king piece - the player whose king got killed loses
                const winner: PlayerType = killedCell.piece.playerType === 'player-two' ? 'player-one' : 'player-two';
                game$.assign({
                    status: 'over',
                    winner: winner
                })

                isGameOver = true;
            }

            // Remove the killed piece from the cell in the grid
            game$.cellGrid[lastLaserSegment.location.rowIndex][lastLaserSegment.location.colIndex].piece.set(null);
        }

        if (!isGameOver) {
            // Next player's turn
            const nextPlayer: PlayerType = game$.turn.player.peek() === 'player-two' ? 'player-one' : 'player-two';
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

    togglePause: (forcePause = false) => {
        const currentGameStatus = game$.status.peek();
        if (currentGameStatus === 'over') {
            // Cannot modify game state if game is paused
            return;
        }

        const shouldBePaused = forcePause === true || currentGameStatus === 'playing';
        game$.status.set(shouldBePaused ? 'paused' : 'playing');
    }
});


// Events
export const selectedPieceRotationEvent = {
    left: event(),
    right: event(),
} as const;