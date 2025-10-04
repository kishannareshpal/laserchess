import type { CellType } from "@/types";
import { Image, Layer } from "react-konva";
import { game$ } from "@/utils/store/game";
import { PositionHelper } from "@/models/helpers/position-helper";
import { useImage } from "react-konva-utils";
import blueLaserCellSvg from '@/assets/blue-laser-cell.svg';
import redLaserCellSvg from '@/assets/red-laser-cell.svg';
import blueReservedCellSvg from '@/assets/blue-reserved-cell.svg';
import redReservedCellSvg from '@/assets/red-reserved-cell.svg';
import { useState, type JSX } from "react";
import { BoardPiece } from "./piece";
import { LocationHelper } from "@/models/helpers/location-helper";
import { CellHelper } from "@/models/helpers/cell-helper";

// import { LaserActionTypesEnum, SquareTypesEnum } from "../../models/Enums";
// import Location from "../../models/Location";
// import { useDispatch, useSelector } from "react-redux";
// import BoardPiece, { pieceAnimDuration, pieceAnimEasing } from "../BoardPiece";
// import { SquareUtils } from "../../models/Square";
// import { flatMap, isEmpty } from "lodash";
// import { applyMovement, selectPiece, unselectPiece } from "../../redux/slices/gameSlice";
// import Board from "../../models/Board";
// import PieceMoveHighlight from "../PieceMoveHighlight";

/**
 * Hex color representing the cell background
 * @constant
 */
const CELL_BACKGROUND_COLOR: string = "#E2C8B6"; // a sort of dark grey #313134 FFD9C6 E2C8B6

/**
 * Hex color representing the cell's stroke
 * @constant
 */
const CELL_STROKE_COLOR: string = "#FFE8D6"; // a sort of dark grey #313134


// type BoardLayerProps = {
// 	/**
// 	 * Ref to the Layer containing all the pieces. Used to access Konva methods on the pieces.
// 	 */
// 	// reference: React.RefObject<any>,

// 	/**
// 	 * The size of a single cell in pixels
// 	 */
// 	// cellSize: number,

// 	/**
// 	 * Callback when a piece is moved on the board.
// 	 * 
// 	 * @param movement 
// 	 * @param srcPieceXY 
// 	 * @returns 
// 	 */
// 	// onBoardPieceMove: (movement: any, srcPieceXY: { x: number, y: number }) => void
// };

// const getCellImage = (squareType: SquareType) => {
// 	switch (squareType) {
// 		case 'laser-blue':
// 			return "/assets/board/blue-laser-cell.svg";
// 		case 'reserved-blue':
// 			return "/assets/board/blue-reserved-cell.svg";
// 		case 'laser-red':
// 			return "/assets/board/red-laser-cell.svg";
// 		case 'reserved-red':
// 			return "/assets/board/red-reserved-cell.svg";
// 		default:
// 			return null;
// 	}
// }

type BoardLayerProps = {
	cellLength: number
}

export const BoardLayer = (
	{ 
		cellLength
		// reference, 
		// cellSize, 
		// onBoardPieceMove
	}: BoardLayerProps
) => {
	const [cellGrid] = useState(game$.board.cellGrid.peek());
	// const cellGrid = use$(game$.board.cellGrid);
	// console.log("Hello")

	// const dispatch = useDispatch();
	// const squares = useSelector(state => state.game.squares);
	// const flattenedSquares = useSelector(state => flatMap(state.game.squares));
	// const movementIsLocked = useSelector(state => state.game.movementIsLocked);
	// const currentPlayer = useSelector(state => state.game.currentPlayer); // It's blue by default!
	// const selectedPieceLocation = useSelector(state => state.game.selectedPieceLocation); // the currently selected square Location, or NULL if none is selected.
	// const laser = useSelector(state => state.game.laser); // So i can enable the laser after the player has moved.

	const [blueLaserCellImage] = useImage(blueLaserCellSvg);
	const [redLaserCellImage] = useImage(redLaserCellSvg);
	const [blueReservedCellImage] = useImage(blueReservedCellSvg);
	const [redReservedCellImage] = useImage(redReservedCellSvg);

	const getCellImage = (cellType: CellType) => {
		switch (cellType) {
			case 'reserved-blue':
				return blueReservedCellImage;
			case 'reserved-red':
				return redReservedCellImage;
			case 'laser-blue':
				return blueLaserCellImage;
			case 'laser-red':
				return redLaserCellImage;
			default:
				return null;
		}
	}

	const drawGrid = (): JSX.Element[] => {
		return cellGrid.flatMap((row) => {
			return row.map((cell) => {
				const cellPosition = PositionHelper.fromLocation(cell.location, cellLength);
				const cellImage = getCellImage(cell.type);

				return (
					<Image
						key={LocationHelper.toAN(cell.location)}
						x={cellPosition.x}
						y={cellPosition.y}
						image={cellImage}
						fill={CELL_BACKGROUND_COLOR}
						stroke={CELL_STROKE_COLOR}
						strokeWidth={2}
						strokeEnabled
						width={cellLength}
						height={cellLength}
					/>
				)
			})
		})
	}

	const drawPieces = (): JSX.Element[] => {
		const pieceElements: JSX.Element[] = [];

		cellGrid.forEach((row) => {
			row.forEach((cell) => {
				if (!CellHelper.hasPiece(cell)) {
					return;
				}

				pieceElements.push(
					<BoardPiece
						key={LocationHelper.toAN(cell.location)}
						cell={cell}
						cellLength={cellLength}
					/>
				)
			});
		});

		return pieceElements;
	}

	// const drawPieces = useCallback(() => {
	// 	const squaresWithPieces = flattenedSquares.filter((square) => {
	// 		// Filter out the squares with no pieces in it.
	// 		// Because we are not drawing empty squares on the board (obviously!)
	// 		return SquareUtils.hasPiece(square);
	// 	});
	// 
	// 	// And finally transform the piece inside the square into Konva's playable "BoardPiece"
	// 	return squaresWithPieces.map((square) => (
	// 		<BoardPiece currentPlayer={currentPlayer}
	// 			movementIsLocked={movementIsLocked}
	// 			id={square.location.an}
	// 			key={`${square.piece.imageName}--${square.location.an}`}
	// 			squares={squares}
	// 			square={square}
	// 			onMove={onBoardPieceMove}
	// 			onGrab={(srcLocation) => {
	// 				// On piece drag, with mouse or touch
	// 				// Show possible moves straight away, much like onSelect
	// 				dispatch(selectPiece({ location: srcLocation }));
	// 			}}
	// 			onSelect={(srcLocation) => {
	// 				// Toggle selection
	// 				if (srcLocation === selectedPieceLocation) {
	// 					// disable selection when tapped agaain on an already selected piece
	// 					dispatch(unselectPiece());

	// 				} else {
	// 					// select the piece
	// 					dispatch(selectPiece({ location: srcLocation }));
	// 				}
	// 			}}
	// 			cellSize={cellSize} />
	// 	));
	// }, [flattenedSquares, currentPlayer, movementIsLocked, squares, onBoardPieceMove, cellSize, dispatch, selectedPieceLocation]);


	// /**
	//  * Highlight possible moves location for the selected piece.
	//  */
	// const drawPossibleMovesHighlight = useCallback(() => {
	// 	// Check if a piece is selected
	// 	if (!isEmpty(selectedPieceLocation)) {
	// 		// Retrieve all possible moves for the selected piece on the current board setting
	// 		const board = new Board({ squares });
	// 		const movesForSelectedPiece = board.getMovesForPieceAtLocation(selectedPieceLocation);
	// 
	// 		// Create the highlight Konva Rect and Circles
	// 		const highlights = [];
	// 		const selectedPieceHighlight = (
	// 			<Rect key="selectedPiece"
	// 				stroke="#f8f32b"
	// 				cornerRadius={8}
	// 				listening={false}
	// 				strokeWidth={2}
	// 				lineCap="round"
	// 				lineJoin="round"
	// 				width={cellSize}
	// 				height={cellSize}
	// 				x={selectedPieceLocation.colIndex * cellSize}
	// 				y={selectedPieceLocation.rowIndex * cellSize} />
	// 		);
	// 		const possibleMovesHighlights = movesForSelectedPiece.map(movement => {
	// 			return (
	// 				<PieceMoveHighlight key={`pmh--${movement.destLocation.an}`}
	// 					cellSize={cellSize}
	// 					onChoose={(move) => {
	// 						Board.presentPieceMovement(reference, move.serialize(), cellSize);
	// 						dispatch(unselectPiece()); // unselect the piece
	// 						// Apply the ai movement on the board state
	// 						setTimeout(() => {
	// 							dispatch(applyMovement({ movement: movement.serialize() }));
	// 						}, 400);
	// 					}}
	// 					movement={movement} />
	// 			);
	// 		});

	// 		highlights.push(possibleMovesHighlights);
	// 		highlights.push(selectedPieceHighlight);
	// 		return highlights;
	// 	}
	// }, [cellSize, dispatch, reference, selectedPieceLocation, squares]);


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
				{drawGrid()}
				{drawPieces()}
				{/* {drawPossibleMovesHighlight()} */}
			</Layer>
			<Layer>
				{/* The laser is drawn on a different layer so it doesn't overlap with the piece on drag */}
				{/* {drawLaser()} */}
			</Layer>
		</>
	);
};