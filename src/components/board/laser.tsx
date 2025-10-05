import { LaserHelper } from "@/models/helpers/laser-helper";
import { PositionHelper } from "@/models/helpers/position-helper";
import type { LaserPathSegment } from "@/models/models/laser";
import type { Position } from "@/models/models/position";
import { game$ } from "@/utils/store/game";
import { useObserveEffect } from "@legendapp/state/react";
import Konva from "konva";
import { useState, type RefObject } from "react";
import { Group, Line, Rect } from "react-konva";
import { LocationHelper } from "@/models/helpers/location-helper";

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
    gridLayerRef: RefObject<Konva.Layer>
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

    useObserveEffect(
        game$.turn.phase,
        ({ value: phase }) => {
            if (phase === 'firing') {
                const laserPath = game$.turn.laserPath.peek();
                const lastLaserSegment = laserPath[laserPath.length - 1];
                const flattenedLaserPathPoints = LaserHelper.convertLaserPathToFlattenedPoints(laserPath, cellLength);

                setLaserPathInfo({
                    flattenedPathPoints: flattenedLaserPathPoints,
                    lastSegment: lastLaserSegment
                });

                if (lastLaserSegment) {
                    setTimeout(() => {
                        const pieceAtfinalLocation = gridLayerRef.current.findOne(`#${LocationHelper.toAN(lastLaserSegment.location)}`);
                        pieceAtfinalLocation?.to({
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
        }
    )

    // const turnPhase = use$(game$.turn.phase)

    // if (turnPhase === 'moving') {
    //     return null;
    // }

    // const 

// /**
	//  * Projects/draws the laser for the currentPlayer.
	//  */
	// const drawLaser = useCallback(() => {
	// 	const linePoints = Board.linePointsFromLaserRoute(laser.route, cellSize);
	// 	const laserGraphics = [];
	// 
	// 	if (linePoints) {
	// 		laserGraphics.push(
				// <Group key="laser-beam">
				// 	<Line points={linePoints}
				// 		stroke="#ff0000"
				// 		shadowEnabled={true}
				// 		shadowColor="#ff0000"
				// 		shadowBlur={8}
				// 		shadowOffsetY={2}
				// 		shadowOffsetX={2}
				// 		lineCap="butt"
				// 		lineJoin="round"
				// 		listening={false}
				// 		strokeWidth={8} />
	
				// 	<Line points={linePoints}
				// 		stroke="#fff"
				// 		lineCap="butt"
				// 		lineJoin="round"
				// 		listening={false}
				// 		strokeWidth={4} />
				// </Group>
	// 		);
	// 	}
	// 
	// 	if (laser.finalActionType === LaserActionTypesEnum.KILL) {
	// 		// Show a temporary red square on top of the piece that was killed.
	// 		laserGraphics.unshift(
				// <Rect key="killed-piece-highlight"
				// 	width={cellSize}
				// 	height={cellSize}
				// 	x={Location.getX(laser.finalLocation.colIndex, cellSize, false)}
				// 	y={Location.getY(laser.finalLocation.rowIndex, cellSize, false)}
				// 	fill="#F7173588" // transparent-red
				// 	cornerRadius={12} />
	// 		);
	// 
	// 		setTimeout(() => {
	// 			// Remove the piece with an animation - shrink it ;)
	// 			const pieceAtfinalLocation = reference.current.find(`#${laser.finalLocation.an}`);
	// 			pieceAtfinalLocation.to({
	// 				scaleY: 0,
	// 				scaleX: 0,
	// 				duration: pieceAnimDuration,
	// 				easing: pieceAnimEasing
	// 			});
	// 		}, 1000);
	// 	}
	//
	// 	return laserGraphics;
	// }, [laser, cellSize, reference]);

    if (!laserPathInfo.flattenedPathPoints.length) {
        return null;
    }

    const lastPathSegmentPosition: Position | null = laserPathInfo.lastSegment 
        ? PositionHelper.fromLocation(laserPathInfo.lastSegment.location, cellLength) 
        : null;

    return (
        <Group>
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