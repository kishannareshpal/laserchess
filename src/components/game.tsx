import { useWindowSize } from "@/hooks/useWindowSize";
import { Board } from "./board/board";
import { game$, onSelectedPieceRotate$ } from "@/utils/store/game$";
import { COLUMN_COUNT, ROW_COUNT } from "@/constants";
import { useState } from "react";

export const Game = () => {
    const [initialCellGrid] = useState(() => structuredClone(game$.cellGrid.peek()));
    const size = useWindowSize();
    
    const maxBoardLength = Math.min(size.width, size.height);
    const cellLength = maxBoardLength / COLUMN_COUNT;
    const boardWidth = cellLength * COLUMN_COUNT;
    const boardHeight = cellLength * ROW_COUNT;

    if (!size.width || !size.height) {
        return null;
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div>
                <Board 
                    width={boardWidth}
                    height={boardHeight}
                    cellLength={cellLength}
                    cellGrid={initialCellGrid} 
                />
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