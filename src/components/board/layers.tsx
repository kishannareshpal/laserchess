import { Layer } from "react-konva";
import { SelectedPiece } from "./selected-piece";
import { Grid } from "./grid";
import { Cells } from "./cells";
import { Fragment, useEffect, useRef } from "react";
import { Laser } from "./laser";
import type Konva from "konva";
import type { CellGrid } from "@/models/models/cell";
import { game$, onSelectedPieceRotate$ } from "@/utils/store/game";
import { PIECE_MOVEMENT_ANIMATION_DURATION, PIECE_MOVEMENT_ANIMATION_EASING_FN } from "@/constants";
import { CellHelper } from "@/models/helpers/cell-helper";

type BoardLayerProps = {
	cellGrid: CellGrid,
	cellLength: number
}

export const Layers = (
	{ 
		cellGrid,
		cellLength 
	}: BoardLayerProps
) => {
	const gridLayerRef = useRef<Konva.Layer>(null!);

	useEffect(() => {
		const disposeOnSelectedPieceRotateLeftEvent = onSelectedPieceRotate$.left.on(() => {
			const currentTurn = game$.turn.peek();
			if (currentTurn.phase !== 'moving' || !currentTurn.selectedPieceLocation) {
				return;
			}

			const selectedCell = CellHelper.getCellAt(game$.cellGrid.peek(), currentTurn.selectedPieceLocation);
			if (!selectedCell) {
				return;
			}

			const selectedCellElement = gridLayerRef.current.findOne(`#c-${selectedCell.id}`);
			if (!selectedCellElement) {
				return;
			}

			selectedCellElement.to({
				rotation: selectedCellElement.rotation() - 90,
				duration: PIECE_MOVEMENT_ANIMATION_DURATION,
				easing: PIECE_MOVEMENT_ANIMATION_EASING_FN
			});

			game$.recordTurnMovement({
				type: 'anticlockwise_rotation',
				sourceCellLocation: currentTurn.selectedPieceLocation,
				targetCellLocation: currentTurn.selectedPieceLocation,
			});
		});

		const disposeOnSelectedPieceRotateRightEvent = onSelectedPieceRotate$.right.on(() => {
			const currentTurn = game$.turn.peek();
			if (currentTurn.phase !== 'moving' || !currentTurn.selectedPieceLocation) {
				return;
			}

			const selectedCell = CellHelper.getCellAt(game$.cellGrid.peek(), currentTurn.selectedPieceLocation);
			if (!selectedCell) {
				return;
			}

			const selectedCellElement = gridLayerRef.current.findOne(`#c-${selectedCell.id}`);
			if (!selectedCellElement) {
				return;
			}

			selectedCellElement.to({
				rotation: selectedCellElement.rotation() + 90,
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
			<Layer ref={gridLayerRef} id="main-layer">
				<Grid
					cellGrid={cellGrid} 
					cellLength={cellLength} 
				/>

				<Cells
					cellGrid={cellGrid} 
					cellLength={cellLength}
					gridLayerRef={gridLayerRef}
				/>

				<SelectedPiece.Highlight cellLength={cellLength} />
				<SelectedPiece.MovementTargetIndicatorCollection
					cellLength={cellLength}
				/>
			</Layer>

			{/* The laser is drawn on a separate layer so it doesn't overlap with the piece on drag */}
			<Layer id="laser-layer">
				<Laser
					cellLength={cellLength}
					gridLayerRef={gridLayerRef}
				/>
			</Layer>
		</Fragment>
	);
};