import { LaserHelper } from "@/models/helpers/laser-helper";
import { PositionHelper } from "@/models/helpers/position-helper";
import type { LaserPathSegment } from "@/models/models/laser";
import type { Position } from "@/models/models/position";
import { game$ } from "@/utils/store/game";
import Konva from "konva";
import { useEffect, useState } from "react";
import { Group, Line, Rect } from "react-konva";
import { CellHelper } from "@/models/helpers/cell-helper";
import type { GridLayerRef } from "@/types";

/**
 * The duration of the animation of a piece movement.
 */
const KILL_ANIMATION_DURATION = 0.332 as const;

/**
 * @constant
 * The easing of the tween for any piece movement
 */
const KILL_ANIMATION_EASING_FN = Konva.Easings.BackEaseOut;

type LaserProps = {
    cellLength: number,
    gridLayerRef: GridLayerRef
}

export const Laser = (
    { 
        cellLength, 
        gridLayerRef 
    }: LaserProps
) => {
    const [laserPathInfo, setLaserPathInfo] = useState<{
        flattenedPathPoints: number[],
        lastSegment: LaserPathSegment | null
    }>({
        flattenedPathPoints: [],
        lastSegment: null
    });

    useEffect(() => {
        game$.turn.phase.onChange(({ value: phase }) => {
            if (phase === 'firing') {
                const laserPath = game$.turn.laserPath.peek();
                const lastLaserSegment = laserPath[laserPath.length - 1];
                const flattenedLaserPathPoints = LaserHelper.convertLaserPathToFlattenedPoints(laserPath, cellLength);

                setLaserPathInfo({
                    flattenedPathPoints: flattenedLaserPathPoints,
                    lastSegment: lastLaserSegment
                });

                if (lastLaserSegment?.effect === 'kill') {
                    const cellAtFinalLocation = CellHelper.getCellAt(game$.cellGrid.peek(), lastLaserSegment.location);
                    const pieceElementFinalLocation = gridLayerRef.current.findOne(`#c-${cellAtFinalLocation.id}`);
                
                    setTimeout(() => {
                        pieceElementFinalLocation?.to({
                            scaleY: 0,
                            scaleX: 0,
                            duration: KILL_ANIMATION_DURATION,
                            easing: KILL_ANIMATION_EASING_FN
                        });
                    }, 1000);
                }

                // Complete the current player's turn
                setTimeout(() => {
                    game$.finishTurn();
                }, 1500)
            } else {
                setLaserPathInfo({
                    flattenedPathPoints: [],
                    lastSegment: null
                })
            }
        })
    }, [cellLength, gridLayerRef])

    if (!laserPathInfo.flattenedPathPoints.length) {
        return null;
    }

    const lastPathSegmentPosition: Position | null = laserPathInfo.lastSegment 
        ? PositionHelper.fromLocation(laserPathInfo.lastSegment.location, cellLength) 
        : null;

    return (
        <Group id="laser-path">
            <Line points={laserPathInfo.flattenedPathPoints}
                stroke="#ff0000"
                shadowEnabled={true}
                shadowColor="#ff0000"
                shadowBlur={8}
                shadowOffsetY={2}
                shadowOffsetX={2}
                lineCap="butt"
                lineJoin="round"
                listening={false}
                strokeWidth={8} />

            <Line points={laserPathInfo.flattenedPathPoints}
                stroke="#fff"
                lineCap="butt"
                lineJoin="round"
                listening={false}
                strokeWidth={4} />


            {(laserPathInfo.lastSegment.effect === 'kill') && lastPathSegmentPosition ? (
                <Rect
                    width={cellLength}
                    height={cellLength}
                    x={lastPathSegmentPosition.x}
                    y={lastPathSegmentPosition.y}
                    fill="#F7173588" // transparent-red
                    cornerRadius={12} />
            ) : null}
        </Group>
    );
}