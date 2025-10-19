import type { Position } from "@/models/position";
import { observable } from "@legendapp/state";

type CellsStoreState = {
    currentDraggingPieceSourcePosition: Position | undefined
}

type CellsStoreComputeds = {
    isAnyPieceBeingDragged: () => boolean
}

type CellsStoreActions = {
    setCurrentDraggingPieceSourcePosition: (position: Position | undefined) => void
}

type CellsStore = CellsStoreState & CellsStoreComputeds & CellsStoreActions;

const initialState: CellsStoreState = {
    currentDraggingPieceSourcePosition: undefined
}

export const cells$ = observable<CellsStore>({
    ...initialState,

    setCurrentDraggingPieceSourcePosition(position) {
        cells$.currentDraggingPieceSourcePosition.set(position);
    },

    isAnyPieceBeingDragged() {
        return cells$.currentDraggingPieceSourcePosition.get() !== undefined;
    },
})