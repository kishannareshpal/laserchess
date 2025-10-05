import { LaserHelper } from "@/models/helpers/laser-helper";
import { PositionHelper } from "@/models/helpers/position-helper";
import type { LaserPathSegment } from "@/models/models/laser";
import type { Position } from "@/models/models/position";
import { game$ } from "@/utils/store/game";
import { useObserveEffect } from "@legendapp/state/react";
import { useState } from "react";
import { Group, Line, Rect } from "react-konva";

type LaserProps = {
    cellLength: number
}

export const Laser = (
    { cellLength }: LaserProps
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
                const flattenedLaserPathPoints = LaserHelper.convertLaserPathToFlattenedPoints(laserPath, cellLength);

                setLaserPathInfo({
                    flattenedPathPoints: flattenedLaserPathPoints,
                    lastSegment: laserPath[laserPath.length - 1]
                });

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