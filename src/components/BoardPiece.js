import React, { useEffect, useRef, useState, useCallback } from "react";
import { isEqual } from "lodash";
import Konva from "konva";
import Location from "../models/Location";
import Movement from "../models/Movement";
import useImage from "use-image";
import { MovementTypesEnum, PieceTypesEnum } from "../models/Enums";
import { Image } from "react-konva";
import Board from "../models/Board";

/**
 * @constant
 * The duration of the animation of a piece movement.
 */
export const pieceAnimDuration = 0.332;

/**
 * @constant
 * The easing of the tween for any piece movement
 */
export const pieceAnimEasing = Konva.Easings.BackEaseOut;

const BoardPiece = ({ id, square: { piece, location }, squares, onMove, onSelect, onGrab, cellSize, currentPlayer, movementIsLocked }) => {
	const [lastXY, setLastXY] = useState({ x: undefined, y: undefined });
	const [pieceImage] = useImage(`https://laserchess.s3.us-east-2.amazonaws.com/pieces/${piece.imageName}.svg`);


	useEffect(() => {
		const xy = {
			x: Location.getX(location.colIndex, cellSize),
			y: Location.getY(location.rowIndex, cellSize)
		};
		setLastXY(xy);
	}, [location, cellSize]);


	// Methods
	const selectThePiece = useCallback(() => {
		// Select the piece.
		// todo allow laser selections and show possible rotations for it!
		if (piece.type !== PieceTypesEnum.LASER) { // Just don't select the piece if it is LASER. TODO
			onSelect(location); // location (aka srcLocation) of the clicked peace
		}
	}, [location, onSelect, piece.type]);


	return (
		<Image draggable={piece.type !== PieceTypesEnum.LASER}
			id={id}
			onTap={selectThePiece}
			onClick={selectThePiece}
			onMouseEnter={(e) => {
				const container = e.target.getStage().container();
				container.style.cursor = "grab";
			}}
			onMouseLeave={(e) => {
				const container = e.target.getStage().container();
				container.style.cursor = "default";
			}}
			dragBoundFunc={(pos) => {
				// Limit drag to inside the canvas.
				const firstSquare = cellSize - (cellSize / 2);
				const lastColHor = (cellSize * 9) + (cellSize / 2);
				const lastColVer = (cellSize * 7) + (cellSize / 2);
				const newX = pos.x > lastColHor ? lastColHor : pos.x < firstSquare ? firstSquare : pos.x;
				const newY = pos.y > lastColVer ? lastColVer : pos.y < firstSquare ? firstSquare : pos.y;
				return {
					x: newX,
					y: newY
				};
			}}
			onDragStart={(e) => {
				// On piece drag, with mouse or touch
				onGrab(location);
				e.target.moveToTop(); // Move up the layer, so it doesn't get hidden beneath other Nodes (pieces)
				const container = e.target.getStage().container();
				container.style.cursor = "grabbing";
			}}
			onDragEnd={(e) => {
				// Handle piece drag and dropping by snapping it to the grid.
				const rawEndX = e.target.x(); // the final X position
				const rawEndY = e.target.y(); // the final Y position
				// Calculate the X and Y used to draw the piece in the board. Having in consideration the margin and the piece offset.
				const endX = (Math.round((rawEndX + (cellSize / 2)) / cellSize) * cellSize) - (cellSize / 2);
				const endY = (Math.round((rawEndY + (cellSize / 2)) / cellSize) * cellSize) - (cellSize / 2);

				const hasChangedLocation = !isEqual(lastXY, { x: endX, y: endY });
				if (hasChangedLocation) {
					const srcLocation = Location.fromXY(lastXY.x, lastXY.y, cellSize);
					const destLocation = Location.fromXY(endX, endY, cellSize);

					// Validate!
					// Check if the destLocation square is a neighbor of the srcLocation.
					const isMovingToNeighbor = Board.isMovingToNeighborSquare(srcLocation, destLocation);
					if (!isMovingToNeighbor) {
						// Not a neighbor square of the srcLocation, so move is invalid by itself.
						// See game rules about piece movement https://github.com/kishannareshpal/docs/Guide.md

						// Reset the piece to where it was before moving.
						e.target.to({
							x: lastXY.x,
							y: lastXY.y,
							duration: pieceAnimDuration,
							easing: pieceAnimEasing
						});

					} else {
						// We are moving to a neighbor, which is a valid move location.
						// But, now we check if we are not stepping into another piece being a piece other than a switch (moving to a square where another piece already exists is only valid for a Switch piece)
						const board = new Board({ squares });
						const movement = board.checkMovePossibility(srcLocation, destLocation);
						// console.log("Move possibility", movement);

						if (!movement.isPossible) {
							// Oh-no, the movement is not possible!
							// The dest location already contains a piece on it and the srcPiece is not a Shield.
							// Or the destLocation is not a neighboring square.
							// Reset the piece to where it was before drag (to it's original location - src).
							e.target.to({
								x: lastXY.x,
								y: lastXY.y,
								duration: pieceAnimDuration,
								easing: pieceAnimEasing
							});

						} else {
							onSelect(null); // Unselect the piece if moved to a different piece
							// Perfect! The movement is possible
							// Check the type of movement, which could be either "special" or "normal"
							if (movement.type === MovementTypesEnum.SPECIAL) {
								// Special move (Switch can swap)
								// Swap the piece from destLocation with the current piece!
								e.target.to({
									x: endX,
									y: endY,
									duration: pieceAnimDuration,
									easing: pieceAnimEasing
								});

								// Replaces the srcPiece with the destPiece and vice versa.
								// Pass the lastXY so we can animate the move of the destPiece to the srcLocation (the switch)!
								onMove(movement, lastXY); // the other piece is moved to the srcLocation on the App.js

							} else if (movement.type === MovementTypesEnum.NORMAL) {
								// Normal move (moving to a new empty target square)
								e.target.to({
									x: endX,
									y: endY,
									duration: pieceAnimDuration,
									easing: pieceAnimEasing
								});

								onMove(movement, null);

							}

							// Update the last position to be this new one
							setLastXY({
								x: endX,
								y: endY
							});
						}
					}

				} else {
					// No movement made at all. Just align back to where it was before drag.
					e.target.to({
						x: endX,
						y: endY,
						duration: pieceAnimDuration,
						easing: pieceAnimEasing
					});
				}

				const container = e.target.getStage().container();
				container.style.cursor = "grab";
			}}
			offset={{
				x: cellSize / 2,
				y: cellSize / 2,
			}}
			image={pieceImage}
			rotation={piece.orientation}
			listening={(piece.color === currentPlayer) && (!movementIsLocked)}
			x={Location.getX(location.colIndex, cellSize)}
			y={Location.getY(location.rowIndex, cellSize)}
			width={cellSize}
			height={cellSize}
		/>
	);
};

export default BoardPiece;
