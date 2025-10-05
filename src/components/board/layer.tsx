import { Layer } from "react-konva";
import { SelectedPiece } from "./selected-piece";
import { Grid } from "./grid";
import { Pieces } from "./pieces";
import { game$ } from "@/utils/store/game";
import { useState } from "react";

type BoardLayerProps = {
	cellLength: number
}

export const BoardLayer = (
	{ cellLength }: BoardLayerProps
) => {
	const [cellGrid] = useState(game$.board.cellGrid.peek());

	// /**
	//  * Projects/draws the laser for the currentPlayer.
	//  */
	// const drawLaser = useCallback(() => {
	// 	const linePoints = Board.linePointsFromLaserRoute(laser.route, cellSize);
	// 	const laserGraphics = [];
	// 
	// 	if (linePoints) {
	// 		laserGraphics.push(
	// 			<Group key="laser-beam">
	// 				<Line points={linePoints}
	// 					stroke="#ff0000"
	// 					shadowEnabled={true}
	// 					shadowColor="#ff0000"
	// 					shadowBlur={8}
	// 					shadowOffsetY={2}
	// 					shadowOffsetX={2}
	// 					lineCap="butt"
	// 					lineJoin="round"
	// 					listening={false}
	// 					strokeWidth={8} />
	// 
	// 				<Line points={linePoints}
	// 					stroke="#fff"
	// 					lineCap="butt"
	// 					lineJoin="round"
	// 					listening={false}
	// 					strokeWidth={4} />
	// 			</Group>
	// 		);
	// 	}
	// 
	// 	if (laser.finalActionType === LaserActionTypesEnum.KILL) {
	// 		// Show a temporary red square on top of the piece that was killed.
	// 		laserGraphics.unshift(
	// 			<Rect key="killed-piece-highlight"
	// 				width={cellSize}
	// 				height={cellSize}
	// 				x={Location.getX(laser.finalLocation.colIndex, cellSize, false)}
	// 				y={Location.getY(laser.finalLocation.rowIndex, cellSize, false)}
	// 				fill="#F7173588" // transparent-red
	// 				cornerRadius={12} />
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

	return (
		<>
			<Layer>
				<Grid
					cellGrid={cellGrid} 
					cellLength={cellLength} 
				/>

				<Pieces
					cellGrid={cellGrid} 
					cellLength={cellLength} 
				/>

				<SelectedPiece.Highlight cellLength={cellLength} />
				<SelectedPiece.MovementTargetIndicatorCollection
					cellLength={cellLength}
				/>
			</Layer>

			<Layer>
				{/* The laser is drawn on a different layer so it doesn't overlap with the piece on drag */}
				{/* {drawLaser()} */}
			</Layer>
		</>
	);
};