import React, { useCallback, useEffect } from "react";
import { Layer, Image, Rect, Group, Line } from "react-konva";
import { LaserActionTypesEnum, PlayerTypesEnum, SquareTypesEnum } from "../models/Enums";
import RedReservedCellSVG from "../assets/red-reserved-cell.svg";
import RedLaserCellSVG from "../assets/red-laser-cell.svg";
import BlueReservedCellSVG from "../assets/blue-reserved-cell.svg";
import BlueLaserCellSVG from "../assets/blue-laser-cell.svg";
import useImage from "use-image";
import Location from "../models/Location";
import { useDispatch, useSelector } from "react-redux";
import BoardPiece, { pieceAnimDuration, pieceAnimEasing } from "./BoardPiece";
import { SquareUtils } from "../models/Square";
import { flatMap, isEmpty } from "lodash";
import { applyMovement, selectPiece, unselectPiece } from "../redux/slices/gameSlice";
import Board from "../models/Board";
import PieceMoveHighlight from "./PieceMoveHighlight";


/**
 * The number of columns of the board
 * @constant
 * @type {number}
 */
const columns = 10;

/**
 * The number of rows of the board
 * @constant
 * @type {number}
 */
const rows = 8;

/**
 * Hex color representing the cell background
 * @constant
 * @type {string} 
 */
const cellBackgroundColor = "#E2C8B6"; // a sort of dark grey #313134 FFD9C6 E2C8B6

/**
 * Hex color representing the cell's stroke
 * @constant
 * @type {string} 
 */
const cellStrokeColor = "#FFE8D6"; // a sort of dark grey #313134


/**
 * The board layer
 */
const BoardLayer = ({ reference, cellSize, onBoardPieceMove }) => {

	const dispatch = useDispatch();
	const squares = useSelector(state => state.game.squares);
	const flattenedSquares = useSelector(state => flatMap(state.game.squares));
	const movementIsLocked = useSelector(state => state.game.movementIsLocked);
	const currentPlayer = useSelector(state => state.game.currentPlayer); // It's blue by default!
	const selectedPieceLocation = useSelector(state => state.game.selectedPieceLocation); // the currently selected square Location, or NULL if none is selected.
	const laser = useSelector(state => state.game.laser); // So i can enable the laser after the player has moved.

	const [blueLaserCellImage] = useImage(BlueLaserCellSVG);
	const [blueReservedCellImage] = useImage(BlueReservedCellSVG);
	const [redLaserCellImage] = useImage(RedLaserCellSVG);
	const [redReservedCellImage] = useImage(RedReservedCellSVG);


	const getCellImage = useCallback((cellType) => {
		switch (cellType) {
			case SquareTypesEnum.RESERVED_BLUE:
				return blueReservedCellImage;
			case SquareTypesEnum.RESERVED_RED:
				return redReservedCellImage;
			case SquareTypesEnum.LASER_BLUE:
				return blueLaserCellImage;
			case SquareTypesEnum.LASER_RED:
				return redLaserCellImage;
			default:
				return null;
		}

	}, [blueLaserCellImage, blueReservedCellImage, redLaserCellImage, redReservedCellImage]);


	const drawGrid = useCallback(() => {
		return flattenedSquares.map(square => {
			return (
				<Image key={`grid--${square.location.rowIndex}${square.location.colIndex}`}
					fill={cellBackgroundColor}
					x={Location.getX(square.location.colIndex, cellSize, false)}
					y={Location.getY(square.location.rowIndex, cellSize, false)}
					stroke={cellStrokeColor}
					image={getCellImage(square.type)}
					strokeWidth={2}
					strokeEnabled={true}
					width={cellSize}
					height={cellSize} />
			);
		});
	}, [cellSize, getCellImage, flattenedSquares]);


	const drawPieces = useCallback(() => {
		const squaresWithPieces = flattenedSquares.filter((square) => {
			// Filter out the squares with no pieces in it.
			// Because we are not drawing empty squares on the board (obviously!)
			return SquareUtils.hasPiece(square);
		});

		// And finally transform the piece inside the square into Konva's playable "BoardPiece"
		return squaresWithPieces.map((square) => (
			<BoardPiece currentPlayer={currentPlayer}
				movementIsLocked={movementIsLocked}
				id={square.location.an}
				key={`${square.piece.imageName}--${square.location.an}`}
				squares={squares}
				square={square}
				onMove={onBoardPieceMove}
				onGrab={(srcLocation) => {
					// On piece drag, with mouse or touch
					// Show possible moves straight away, much like onSelect
					dispatch(selectPiece({ location: srcLocation }));
				}}
				onSelect={(srcLocation) => {
					// Toggle selection
					if (srcLocation === selectedPieceLocation) {
						// disable selection when tapped agaain on an already selected piece
						dispatch(unselectPiece());

					} else {
						// select the piece
						dispatch(selectPiece({ location: srcLocation }));

					}
				}}
				cellSize={cellSize} />
		));
	}, [flattenedSquares, currentPlayer, movementIsLocked, squares, onBoardPieceMove, cellSize, dispatch, selectedPieceLocation]);


	/**
	 * Highlight possible moves location for the selected piece.
	 */
	const drawPossibleMovesHighlight = useCallback(() => {
		// Check if a piece is selected
		if (!isEmpty(selectedPieceLocation)) {
			// Retrieve all possible moves for the selected piece on the current board setting
			const board = new Board({ squares });
			const movesForSelectedPiece = board.getMovesForPieceAtLocation(selectedPieceLocation);

			// Create the highlight Konva Rect and Circles
			const highlights = [];
			const selectedPieceHighlight = (
				<Rect key="selectedPiece"
					stroke="#f8f32b"
					cornerRadius={8}
					listening={false}
					strokeWidth={2}
					lineCap="round"
					lineJoin="round"
					width={cellSize}
					height={cellSize}
					x={selectedPieceLocation.colIndex * cellSize}
					y={selectedPieceLocation.rowIndex * cellSize} />
			);
			const possibleMovesHighlights = movesForSelectedPiece.map(movement => {
				return (
					<PieceMoveHighlight key={`pmh--${movement.destLocation.an}`}
						cellSize={cellSize}
						onChoose={(move) => {
							Board.presentPieceMovement(reference, move.serialize(), cellSize);
							dispatch(unselectPiece()); // unselect the piece
							// Apply the ai movement on the board state
							setTimeout(() => {
								dispatch(applyMovement({ movement: movement.serialize() }));
							}, 400);
						}}
						movement={movement} />
				);
			});

			highlights.push(possibleMovesHighlights);
			highlights.push(selectedPieceHighlight);
			return highlights;
		}
	}, [cellSize, dispatch, reference, selectedPieceLocation, squares]);


	/**
	 * Projects/draws the laser for the currentPlayer.
	 */
	const drawLaser = useCallback(() => {
		const linePoints = Board.linePointsFromLaserRoute(laser.route, cellSize);
		const laserGraphics = [];

		if (linePoints) {
			laserGraphics.push(
				<Group key="laser-beam">
					<Line points={linePoints}
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

					<Line points={linePoints}
						stroke="#fff"
						lineCap="butt"
						lineJoin="round"
						listening={false}
						strokeWidth={4} />
				</Group>
			);
		}

		if (laser.finalActionType === LaserActionTypesEnum.KILL) {
			// Show a temporary red square on top of the piece that was killed.
			laserGraphics.unshift(
				<Rect key="killed-piece-highlight"
					width={cellSize}
					height={cellSize}
					x={Location.getX(laser.finalLocation.colIndex, cellSize, false)}
					y={Location.getY(laser.finalLocation.rowIndex, cellSize, false)}
					fill="#F7173588" // transparent-red
					cornerRadius={12} />
			);

			setTimeout(() => {
				// Remove the piece with an animation - shrink it ;)
				const pieceAtfinalLocation = reference.current.find(`#${laser.finalLocation.an}`);
				pieceAtfinalLocation.to({
					scaleY: 0,
					scaleX: 0,
					duration: pieceAnimDuration,
					easing: pieceAnimEasing
				});
			}, 1000);
		}

		return laserGraphics;
	}, [laser, cellSize, reference]);


	return (
		<>
			<Layer ref={reference}>
				{drawGrid()}
				{drawPieces()}
				{drawPossibleMovesHighlight()}
			</Layer>
			<Layer>
				{/* I am drawing this laser on a different layer because it was overlapping with the piece onDrag */}
				{drawLaser()}
			</Layer>
		</>
	);
};


export default BoardLayer;