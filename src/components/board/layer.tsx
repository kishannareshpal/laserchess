import { Layer } from "react-konva";
import { SelectedPiece } from "./selected-piece";
import { Grid } from "./grid";
import { Pieces } from "./pieces";
import { game$ } from "@/utils/store/game";
import { useRef, useState } from "react";
import { Laser } from "./laser";
import type Konva from "konva";

type BoardLayerProps = {
	cellLength: number
}

export const BoardLayer = (
	{ cellLength }: BoardLayerProps
) => {
	const [cellGrid] = useState(game$.board.cellGrid.peek());
	const gridLayerRef = useRef<Konva.Layer>(null!)

	return (
		<>
			<Layer ref={gridLayerRef}>
				<Grid
					cellGrid={cellGrid} 
					cellLength={cellLength} 
				/>

				<Pieces
					cellGrid={cellGrid} 
					cellLength={cellLength}
					gridLayerRef={gridLayerRef}
				/>

				<SelectedPiece.Highlight cellLength={cellLength} />
				<SelectedPiece.MovementTargetIndicatorCollection
					cellLength={cellLength}
				/>
			</Layer>

			<Layer>
				{/* The laser is drawn on a separate layer so it doesn't overlap with the piece on drag */}
				<Laser 
					cellLength={cellLength}
					gridLayerRef={gridLayerRef}
				/>
			</Layer>
		</>
	);
};