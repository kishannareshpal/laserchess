import React, { useCallback, useRef, useState, useEffect } from "react";
import { Stage } from "react-konva";
import BoardLayer from "./components/BoardLayer";
import { pieceAnimDuration, pieceAnimEasing } from "./components/BoardPiece";
import "./App.scss";
import LogoPNG from "./assets/logo.png";
import BluePlayerProfile from "./assets/ui/blue-player-profile.png";
import RedPlayerProfile from "./assets/ui/red-player-profile.png";
import { Provider, ReactReduxContext, useDispatch, useSelector } from "react-redux";
import { setBoardType, applyMovement, computeAIMovement, toggleAI, finishMovement, unselectPiece } from "./redux/slices/gameSlice";
import { MovementTypesEnum, PlayerTypesEnum } from "./models/Enums";
import Board from "./models/Board";
import { IconButton } from "@material-ui/core";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import RotateRightIcon from "@material-ui/icons/RotateRight";
import Movement from "./models/Movement";



function App() {

	// The stage width. This is dynamic, and changes on window resize.
	const [stageWidth, setStageWidth] = useState(700);

	const aiEnabled = useSelector(state => state.game.ai.enabled);
	const aiMovement = useSelector(state => state.game.ai.movement);

	const selectedPieceLocation = useSelector(state => state.game.selectedPieceLocation);
	const currentPlayer = useSelector(state => state.game.currentPlayer); // It's blue by default!
	const laser = useSelector(state => state.game.laser); // So i can enable the laser after the player has moved.
	// const status = useSelector(state => state.game.status); // Current game state
	const winner = useSelector(state => state.game.winner); // The winner of this match!

	const stagePiecesRef = useRef(); // A reference to the stage, used to find BoardPieces afterwards.
	const stageContainerRef = useRef(); // A reference to the Div containing the stage
	const dispatch = useDispatch();


	// Methods
	const getBoardSize = useCallback(() => {
		return stageWidth;
	}, [stageWidth]);


	const getCellSize = useCallback(() => {
		return getBoardSize() / 10;
	}, [getBoardSize]);


	/**
	 * Resizes the stage width to match the DIV parent.
	 * For page responsiveness.
	 * This function is called on the "resize" event of the window.
	 */
	const refreshBoardSize = () => {
		const width = stageContainerRef.current.offsetWidth;
		setStageWidth(width);
	};

	useEffect(() => {
		// Setup the board pieces.
		dispatch(setBoardType());

		// Handle stage responsiveness
		// take a look here https://developers.google.com/web/updates/2016/10/resizeobserver
		// for simplicity I will just listen window resize
		refreshBoardSize();
		window.addEventListener("resize", refreshBoardSize);

		return () => {
			// clear on unmount to prevent memory leak!
			window.removeEventListener("resize", refreshBoardSize);
		};
	}, [dispatch]);


	useEffect(() => {
		// Shows the laser path, after each move for the player on the move.
		// Automatically hides it after 2 sec.
		// ? Maybe add an option to define for how long the laser beam should be shown
		if (laser.route.length > 0) {
			setTimeout(() => {
				// finish the movement for the current player.
				dispatch(finishMovement());
			}, 1500);
		}
	}, [dispatch, laser.route]);


	useEffect(() => {
		if (currentPlayer === PlayerTypesEnum.RED && aiEnabled) {
			// Perform the move as AI
			// Apply the new move to the board state.
			dispatch(computeAIMovement());
		}
	}, [currentPlayer, aiEnabled, dispatch]);

	useEffect(() => {
		if (aiMovement) {
			// If the ai is moving, perform the movement animation
			Board.presentPieceMovement(stagePiecesRef, aiMovement, getCellSize());

			// Apply the ai movement on the board state
			setTimeout(() => {
				dispatch(applyMovement({ movement: aiMovement }));
			}, 332);
		}
	}, [dispatch, aiMovement, getCellSize]);


	// Renderers
	return (
		<div>
			<nav className="navbar lc-nav border-bottom">
				<div className="container">
					<a className="navbar-brand" href="#">
						<img src={LogoPNG} alt="laser-chess.com logo" height="52" />
					</a>
				</div>
			</nav>

			<div className="container section mt-4">

				{winner && <h4>🎉 {winner.toUpperCase()} player wins!</h4>}

				<div className="row align-items-center">
					<div className="col-12 col-lg-6">
						<div>
							<div className="text-white py-3">
								<div className="row align-items-center">
									<div className="col-auto">
										<img height={36} src={RedPlayerProfile} alt="rpp" />
									</div>
									<div className={`col ${currentPlayer === PlayerTypesEnum.RED ? "text-danger" : "text-muted"}`}>
										<div className="row align-items-center justify-content-between gx-4">
											<div className="col-auto">
												<h4 className="m-0">
													Red Player
												</h4>
											</div>
											<div className="col">
												<div hidden={(currentPlayer !== PlayerTypesEnum.RED) || (aiEnabled)} className="badge rounded-pill bg-dark text-light">Your turn</div>
											</div>
											<div className="col-auto">
												<div className="form-check form-switch m-0">
													<label className="form-check-label fw-bold" htmlFor="aiModeSwitch">AI Mode {aiEnabled}</label>
													<input checked={aiEnabled}
														onChange={(e) => {
															// Toggle ai mode for next moves of RED player
															dispatch(toggleAI());
														}}
														className="form-check-input"
														type="checkbox"
														id="aiModeSwitch" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="board" ref={stageContainerRef}>
								{/* Passing our store from current DOM context, to the Canvas context. This allows us to access our store from the Konva elements aswell. */}
								<ReactReduxContext.Consumer>
									{({ store }) => (
										<Stage id="stage" className="stage"
											onClick={(e) => {
												// if (!e.target.id()) {
												// 	dispatch(unselectPiece()); // unselect
												// }
											}}
											onTap={(e) => {
												// if (!e.target.id()) {
												// 	dispatch(unselectPiece()); // unselect
												// }
											}}
											width={getBoardSize()}
											height={getBoardSize() - (2 * (getCellSize()))}>

											<Provider store={store}>
												<BoardLayer
													reference={stagePiecesRef}
													cellSize={getCellSize()}
													onBoardPieceMove={(movement, srcPieceXY) => {
														// console.log("Movement made!", movement);
														// console.log("From board: ", board);

														// For Special move only, we need to animate the switch manually.
														// You can comment out this part of the code if you prefer reduced motion (no move animation)
														if (movement.type === MovementTypesEnum.SPECIAL) {
															// Grab the piece that is being switched with the Switch piece.
															const [destBoardPiece] = stagePiecesRef.current.find(`#${movement.destLocation.an}`);

															// And move it to where the Switch piece srcLocation (Because you are already dragging the Switch to the destLocation)
															destBoardPiece.to({
																x: srcPieceXY.x,
																y: srcPieceXY.y,
																duration: pieceAnimDuration,
																easing: pieceAnimEasing
															});
														}

														// Perform the movement
														// - Only delay if the movement type is NORMAL or SPECIAL (bc there is some animation on these movement types). 
														//   No need to delay while rotating, cause its istant!
														// ? Add an option to disable animations.
														let delayed = !(movement.type === MovementTypesEnum.ROTATION_CLOCKWISE || movement.type === MovementTypesEnum.ROTATION_C_CLOCKWISE);
														if (delayed) {
															// Delay the state change so that the konva animation finishes.
															setTimeout(() => {
																dispatch(applyMovement({ movement: movement.serialize() }));
															}, 332); // 332ms is the tween duration for every piece movement in the game.

														} else {
															dispatch(applyMovement({ movement: movement.serialize() }));
														}
													}} />
											</Provider>
										</Stage>
									)}
								</ReactReduxContext.Consumer>
							</div>
							<div className="text-white py-3">
								<div className="row align-items-center">
									<div className="col-auto">
										<img height={36} src={BluePlayerProfile} alt="bpp" />
									</div>
									<div className={`col ${currentPlayer === PlayerTypesEnum.BLUE ? "text-primary" : "text-muted"}`}>
										<div className="row align-items-center gx-4">
											<div className="col-auto">
												<h4 className="m-0">
													Blue Player
												</h4>
											</div>
											<div className="col">
												<div hidden={currentPlayer !== PlayerTypesEnum.BLUE} className="badge rounded-pill bg-dark text-light">Your turn</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							{/* Controls for selected piece */}
							<div className="mt-3">
								<div className="row align-items-center justify-content-center mb-0">
									<div className="col-auto lc-controls p-3">
										<div className="row align-items-center gx-4">
											<div className="col-auto fw-bold lc-controls--text">
												Rotate
											</div>
											<div className="col-auto">
												<IconButton className="lc-btn-control"
													onClick={() => {
														dispatch(unselectPiece()); // unselect the piece
														// If the ai is moving, perform the movement animation
														const movement = new Movement(MovementTypesEnum.ROTATION_C_CLOCKWISE, selectedPieceLocation, null);
														Board.presentPieceMovement(stagePiecesRef, movement, getCellSize());

														// Apply this rotation movement on the board state
														setTimeout(() => {
															dispatch(applyMovement({ movement: movement.serialize() }));
														}, 332);
													}}
													disabled={selectedPieceLocation === null}
													aria-label="rotate piece left">
													<RotateLeftIcon />
												</IconButton>
											</div>
											<div className="col-auto border-start lc-controls--divider">
												<IconButton className="lc-btn-control"
													onClick={() => {
														dispatch(unselectPiece(null)); // unselect the piece
														const movement = new Movement(MovementTypesEnum.ROTATION_CLOCKWISE, selectedPieceLocation, null);
														Board.presentPieceMovement(stagePiecesRef, movement, getCellSize());

														// Apply this rotation movement on the board state
														setTimeout(() => {
															dispatch(applyMovement({ movement: movement.serialize() }));
														}, 332);
													}}
													disabled={selectedPieceLocation === null}
													aria-label="rotate piece right">
													<RotateRightIcon />
												</IconButton>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col text-dark">

					</div>
				</div>
			</div>


			<div className="container mt-5 p-3 text-muted">
				<hr />
				<a href="https://github.com/kishannareshpal/laserchess"><img alt="GitHub release" src="https://img.shields.io/github/v/release/kishannareshpal/laserchess?include_prereleases&label=laserchess&style=flat-square"></img></a> • <a className="text-muted" href="https://kishanjadav.com">Kishan Jadav</a>
			</div>
		</div >
	);
}

export default App;
