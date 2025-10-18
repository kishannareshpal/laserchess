import { Board } from "./board/board";
import { game$ } from "@/utils/store/game$";
import { COLUMN_COUNT, ROW_COUNT } from "@/constants";
import { useEffect, useRef, useState } from "react";
import { RotationController } from "./rotation-controller";
import { UserIcon } from "lucide-react"
import type { Size } from "@/models/models/size";
import { SizeHelper } from "@/models/helpers/size-helper";

export const Game = () => {
    const [initialCellGrid] = useState(() => structuredClone(game$.cellGrid.peek()));
    const [boardContainerSize, setBoardContainerSize] = useState<Size>(SizeHelper.zero());
    const boardContainerRef = useRef<HTMLDivElement>(null!);
   
    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry || !entry.contentRect) {
                return;
            }

            // this callback gets executed whenever the size changes
            // when size changes get the width and update the state
            // so that the Child component can access the updated width
            setBoardContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
        });

        // register the observer for the div
        const current = boardContainerRef.current;
        resizeObserver.observe(current);

        // unregister the observer
        return () => resizeObserver.unobserve(current);
    }, []);

    const minContainerLength = Math.floor(Math.min(boardContainerSize.width, boardContainerSize.height));
    const cellLength = Math.floor(minContainerLength / Math.max(COLUMN_COUNT, ROW_COUNT));
    const boardWidth = cellLength * COLUMN_COUNT;
    const boardHeight = cellLength * ROW_COUNT;


    return (
        <div className="flex flex-col w-full gap-4">
            <div ref={boardContainerRef} className="flex flex-1 flex-col">
                <div className="inline-flex flex-col gap-4 self-center p-2">
                    <div className="flex">
                        <div className="flex gap-2 rounded-lg">
                            <UserIcon />
                            <p>Player two</p>
                        </div>
                    </div>

                    <Board 
                        width={boardWidth}
                        height={boardHeight}
                        cellLength={cellLength}
                        cellGrid={initialCellGrid} 
                    />

                    <div className="flex justify-between items-start">
                        <div className="flex">
                            <div className="flex justify-center items-center gap-2 rounded-lg">
                                <UserIcon />
                                <div>
                                    <p>Player one</p>
                                    <p className="text-sm text-white/75">Your turn</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <RotationController />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}