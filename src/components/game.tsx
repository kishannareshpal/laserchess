import { Board } from "./game/board/board";
import { game$ } from "@/lib/store/game$";
import { useState } from "react";
import { RotationController } from "./game/controller/rotation-controller";
import { GameOverOverlay } from "./game/game-over-overlay";
import { PlayerDetails } from "./game/player-details";
import { useElementSize } from "@/lib/hooks/use-element-size";
import { BoardUIHelper } from "@/models/helpers/board-ui-helper";

export const Game = () => {
    const [initialCellGrid] = useState(() => structuredClone(game$.cellGrid.peek()));
    const [boardContainerSize, boardContainerRef] = useElementSize<HTMLDivElement>();

    const { cellLength, boardWidth, boardHeight } = BoardUIHelper.calculateOptimalLayout(boardContainerSize);

    return (
        <div className="flex flex-col w-full gap-4">
            <div ref={boardContainerRef} className="flex flex-1 flex-col">
                <div className="inline-flex flex-col gap-2 self-center p-2">
                    <div className="flex justify-between items-center">
                        <div className="flex">
                            <PlayerDetails playerType="player-two" />
                        </div>
                    </div>

                    <div className="flex rounded-3xl relative">
                        <GameOverOverlay />

                        <Board
                            width={boardWidth}
                            height={boardHeight}
                            cellLength={cellLength}
                            cellGrid={initialCellGrid}
                        />
                    </div>

                    <div className="flex justify-between items-start">
                        <div className="flex">
                            <PlayerDetails playerType="player-one" />
                        </div>

                        <div className="flex flex-col items-end">
                            <RotationController />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}