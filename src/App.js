import React, { useCallback, useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import { isEmpty, flatMap } from "lodash";
import BoardLayer from "./components/BoardLayer";
import BoardPiece from "./components/BoardPiece";
import useWindowSize from "./hooks/useWindowSize";
import Engine from "./utils/Engine";
import { useDispatch, useSelector } from "react-redux";
import { init, togglePlayerTurn, hideLaserBeam, move } from "./redux/slices/gameSlice";
import { LocationUtils } from "./models/Location";
import { SquareUtils } from "./models/Square";
import { MovementTypesEnum, PlayerTypesEnum } from "./models/Enums";



const boardSize = 700;
const gridSize = boardSize / 10; // 10 is the number of cols.

function App() {
	// the curent selected piece AN string.
	const [selectedPieceLocation, setSelectedPieceLocation] = useState(null);

	const board = useSelector(state => state.game.board); // The current board
	const turn = useSelector(state => state.game.turn); // It's blue by default!
	const laserBeamPath = useSelector(state => state.game.laserBeamPath); // So i can enable the laser after the player has moved.
	const laserIsTriggered = useSelector(state => state.game.laserIsTriggered); // So i can enable the laser after the player has moved.
	const status = useSelector(state => state.game.status); // Current game state
	const winner = useSelector(state => state.game.winner); // The winner of this match!

	const stageRef = useRef();
	const dispatch = useDispatch();


	useEffect(() => {
		// Setup the board pieces.
		dispatch(init());

	}, [dispatch]);


	// Methods
	useEffect(() => {
		// Shows the laser path, after each move for the player on the move.
		// Automatically hides it after 2 sec.
		// ? Maybe add an option to define how long the laser beam should be shown
		if (laserBeamPath.length) {
			setTimeout(() => {
				// hide
				dispatch(togglePlayerTurn());
				dispatch(hideLaserBeam());
			}, 500);
		}

	}, [dispatch, laserBeamPath]);



	// Renderers
	/**
	 * Highlight possible moves location for the selected piece.
	 */
	const drawHighlight = useCallback(() => {
		// Check if a piece is selected
		if (!isEmpty(selectedPieceLocation)) {
			// Retrieve all possible moves for the selected piece
			const allMovePossibilities = Engine.checkAllMovePossibilities(selectedPieceLocation, board);
			console.log("Possible moves", allMovePossibilities);

			// Create the highlight Konva Rect and Circles
			const highlights = [];
			const selectedPieceHighlight = (
				<Rect key="selectedPiece"
					stroke="#F8F32B"
					cornerRadius={12}
					listening={false}
					strokeWidth={4}
					lineCap="round"
					lineJoin="round"
					width={gridSize}
					height={gridSize}
					x={selectedPieceLocation.colIndex * gridSize}
					y={selectedPieceLocation.rowIndex * gridSize} />
			);
			const possibleMovesHighlights = allMovePossibilities.map(move => {
				return (
					<Circle key={`pm--${LocationUtils.toANString(move.destLocation)}`}
						fill="#1EFC1E9F"
						offsetX={-gridSize / 2}
						offsetY={-gridSize / 2}
						listening={false}
						width={32}
						height={32}
						stroke="#1EFC1E"
						strokeWidth={4}
						perfectDrawEnabled={false}
						x={(move.destLocation.colIndex * gridSize)}
						y={(move.destLocation.rowIndex * gridSize)} />
				);
			});

			highlights.push(selectedPieceHighlight);
			highlights.push(possibleMovesHighlights);
			return highlights;
		}

	}, [selectedPieceLocation, board]);


	/**
	 * Draw the pieces given the current board!
	 */
	const drawBoardPieces = useCallback(() => {
		// flatten all rows into a single array
		// console.log(board);
		const flattened = flatMap(board);
		const squares = flattened.filter((square) => {
			// Filter out the squares with no pieces in it.
			// Because we are not drawing empty squares on the board (obviously!)
			return SquareUtils.hasPiece(square);
		});

		// Transform the pieces inside the square into Konva's BoardPiece
		return squares.map((square) => (
			<BoardPiece turn={turn}
				laserIsTriggered={laserIsTriggered}
				id={LocationUtils.toANString(square.location)}
				key={`${square.piece.imageName}--${LocationUtils.toANString(square.location)}`}
				board={board}
				square={square}
				onMove={(movement, srcPieceXY) => {
					// console.log("Movement made!", movement);
					// console.log("From board: ", board);

					// For Special move only, we need to animate the switch manually.
					// You can comment out this part of the code if you prefer reduced motion (no move animation)
					if (movement.type === MovementTypesEnum.SPECIAL) {
						// Grab the piece that is being switched with the Switch piece.
						const destPieceId = LocationUtils.toANString(movement.destLocation);
						const query = stageRef.current.find(`#${destPieceId}`);
						const destPieceRaw = query[0];

						// And move it to where the Switch piece srcLocation (Because you are already dragging the Switch to the destLocation)
						destPieceRaw.to({
							x: srcPieceXY.x,
							y: srcPieceXY.y,
							duration: 0.332,
							easing: Konva.Easings.BackEaseOut
						});
					}

					// Perform the movement
					// - Only delay if the movement type is NORMAL or SPECIAL (bc there is some animation on these movement types). 
					//   No need to delay while rotating, cause it's istant!
					// ? Add an option to disable animations.
					let delayed = !(movement.type === MovementTypesEnum.ROTATION_CLOCKWISE || movement.type === MovementTypesEnum.ROTATION_C_CLOCKWISE);
					if (delayed) {
						// Delay the state change so that the konva animation finishes.
						setTimeout(() => {
							dispatch(move({ movement }));
						}, 332); // 332ms is the tween duration for every piece movement in the game.

					} else {
						dispatch(move({ movement }));
					}
				}}

				onSelect={(srcLocation) => {
					setSelectedPieceLocation(srcLocation);
				}}
				gridSize={gridSize} />
		));
	}, [board, turn, laserIsTriggered, dispatch]);



	const drawLaser = useCallback(() => {
		const points = laserBeamPath.map(coord => coord * gridSize + (gridSize / 2));
		if (points) {
			return (
				<Line points={points}
					stroke={turn === PlayerTypesEnum.BLUE ? "#00FFEB" : "#FF7600"}
					lineCap="round"
					lineJoin="round"
					listening={false}
					strokeWidth={7} />
			);
		}
	}, [laserBeamPath, turn]);


	return (
		<div>
			<Stage className="board-color" width={boardSize} height={boardSize - (2 * (boardSize / 10))}>
				<BoardLayer boardSize={boardSize} gridSize={gridSize} />

				<Layer ref={stageRef}>
					{drawBoardPieces()}
					{drawHighlight()}
				</Layer>

				<Layer>
					{drawLaser()}
				</Layer>
			</Stage>

			<div className="card rounded-lg d-inline-block p-4 m-4">
				{/* Ellapsed: <CountUp start={0} end={1000} startOnMount={true} duration={1000} /> */}
				<h4 className="m-0">Now playing: <strong>{turn.toUpperCase()}</strong></h4>
				{winner && <h1>🎉 {winner.toUpperCase()} player wins!</h1>}
			</div>
		</div>
	);
}

export default App;
