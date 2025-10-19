import { Layer } from "react-konva";
import { GridLines } from "./grid-lines";
import { Fragment, useEffect, useRef } from "react";
import { Laser } from "./laser";
import type Konva from "konva";
import type { CellGrid } from "@/models/models/cell";
import { game$, selectedPieceRotationEvent } from "@/utils/store/game$";
import { PIECE_MOVEMENT_ANIMATION_DURATION, PIECE_MOVEMENT_ANIMATION_EASING_FN } from "@/constants";
import { CellHelper } from "@/models/helpers/cell-helper";
import { Cell } from "./cell";

type BoardLayerProps = {
	cellGrid: CellGrid,
	width: number,
	height: number,
	cellLength: number
}

export const Layers = (
	{
		cellGrid,
		width,
		height,
		cellLength
	}: BoardLayerProps
) => {
	const gridLayerRef = useRef<Konva.Layer>(null!);

	useEffect(() => {
		const disposeOnSelectedPieceRotateLeftEvent = selectedPieceRotationEvent.left.on(() => {
			const currentTurn = game$.turn.peek();
			if (currentTurn.phase !== 'moving' || !currentTurn.selectedPieceLocation) {
				return;
			}

			const selectedCell = CellHelper.getCellAt(game$.cellGrid.peek(), currentTurn.selectedPieceLocation);
			if (!selectedCell) {
				return;
			}

			const selectedCellElement = gridLayerRef.current.findOne(`#cp-${selectedCell.id}`);
			if (!selectedCellElement) {
				return;
			}

			selectedCellElement.to({
				rotation: selectedCell.piece.orientation - 90,
				duration: PIECE_MOVEMENT_ANIMATION_DURATION,
				easing: PIECE_MOVEMENT_ANIMATION_EASING_FN
			});

			game$.recordTurnMovement({
				type: 'anticlockwise_rotation',
				sourceCellLocation: currentTurn.selectedPieceLocation,
				targetCellLocation: currentTurn.selectedPieceLocation,
			});
		});

		const disposeOnSelectedPieceRotateRightEvent = selectedPieceRotationEvent.right.on(() => {
			const currentTurn = game$.turn.peek();
			if (currentTurn.phase !== 'moving' || !currentTurn.selectedPieceLocation) {
				return;
			}

			const selectedCell = CellHelper.getCellAt(game$.cellGrid.peek(), currentTurn.selectedPieceLocation);
			if (!selectedCell) {
				return;
			}

			const selectedCellElement = gridLayerRef.current.findOne(`#cp-${selectedCell.id}`);
			if (!selectedCellElement) {
				return;
			}

			selectedCellElement.to({
				rotation: selectedCell.piece.orientation + 90,
				duration: PIECE_MOVEMENT_ANIMATION_DURATION,
				easing: PIECE_MOVEMENT_ANIMATION_EASING_FN
			});

			game$.recordTurnMovement({
				type: 'clockwise_rotation',
				sourceCellLocation: currentTurn.selectedPieceLocation,
				targetCellLocation: currentTurn.selectedPieceLocation,
			});
		});

		return () => {
			disposeOnSelectedPieceRotateLeftEvent();
			disposeOnSelectedPieceRotateRightEvent();
		}
	}, []);

	return (
		<Fragment>
			<Layer id="main-layer" ref={gridLayerRef}>
				<Cell.BackgroundCollection
					cellGrid={cellGrid}
					cellLength={cellLength}
				/>

				<Cell.Collection
					cellGrid={cellGrid}
					cellLength={cellLength}
					gridLayerRef={gridLayerRef}
				/>

				<Cell.Selection.PossibleTargets
					cellLength={cellLength}
					gridLayerRef={gridLayerRef}
				/>

				<GridLines
					canvasSize={{ width: width, height: height }}
					cellLength={cellLength}
				/>

				<Cell.Selection.Highlight cellLength={cellLength} />
			</Layer>

			{/* The laser is drawn on a separate layer that sits on top of all the other elements so it doesn't overlap with the piece */}
			<Layer id="top-layer">
				<Laser
					cellLength={cellLength}
					gridLayerRef={gridLayerRef}
				/>
			</Layer>
		</Fragment>
	);
};