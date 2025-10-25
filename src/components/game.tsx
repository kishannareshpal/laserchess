import { Board } from "./game/board/board";
import { BoardUIHelper } from "@/models/helpers/board-ui-helper";
import { GameOverOverlay } from "./game/game-over-overlay";
import { PlayerDetails } from "./game/player-details";
import { RotationController } from "./game/controller/rotation-controller";
import { clsx } from "clsx";
import { game$ } from "@/lib/store/game$";
import { settings$ } from "@/lib/store/settings$";
import { useElementSize } from "@/lib/hooks/use-element-size";
import { useState } from "react";
import { useValue } from "@legendapp/state/react";

export const Game = () => {
    const turnPlayer = useValue(game$.turn.player);
    const tabletopMode = useValue(settings$.tabletopMode);

    const [initialCellGrid] = useState(() => structuredClone(game$.cellGrid.peek()));
    const [boardContainerSize, boardContainerRef] = useElementSize<HTMLDivElement>();

    const { cellLength, boardWidth, boardHeight } = BoardUIHelper.calculateOptimalLayout(boardContainerSize);

    return (
        <div className="flex flex-col w-full gap-4">
            <div ref={boardContainerRef} className="flex flex-1 flex-col">
                <div className="inline-flex flex-col gap-2 self-center p-2">
                    <div className={clsx("flex justify-between items-center", tabletopMode ? 'rotate-180' : undefined)}>
                        <div className="flex">
                            <PlayerDetails playerType="player-two" />
                        </div>

                        {tabletopMode ? (
                            <div className={clsx("flex flex-col items-end duration-300", turnPlayer === 'player-two' ? 'opacity-100' : 'opacity-0')}>
                                <RotationController />
                            </div>
                        ) : null}
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

                        <div className={clsx("flex flex-col items-end duration-300", !tabletopMode || turnPlayer === 'player-one' ? 'opacity-100' : 'opacity-0')}>
                            <RotationController />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}