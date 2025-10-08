import { Board } from "./board/board";
import { game$, onSelectedPieceRotate$ } from "@/utils/store/game$";
import { use$ } from "@legendapp/state/react";

export const Game = () => {
    const initialCellGrid = use$(() => structuredClone(game$.cellGrid.peek()));

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div>
                <Board cellGrid={initialCellGrid} />
            </div>

            <div className="flex">
                <button type="button" className="outline-none p-2 active:bg-black active:text-white" onClick={() => onSelectedPieceRotate$.left.fire()}>
                    Left
                </button>

                <button type="button" className="outline-none p-2 active:bg-black active:text-white" onClick={() => onSelectedPieceRotate$.right.fire()}>
                    Right
                </button>
            </div>
        </div>
    )
}