import { Layer } from "react-konva";
import { SelectedPiece } from "./selected-piece";
import { Grid } from "./grid";
import { Pieces } from "./pieces";
import { game$ } from "@/utils/store/game";
import { useState } from "react";
import { Laser } from "./laser";

type BoardLayerProps = {
	cellLength: number
}

export const BoardLayer = (
	{ cellLength }: BoardLayerProps
) => {
	const [cellGrid] = useState(game$.board.cellGrid.peek());

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
				<Laser cellLength={cellLength} />
			</Layer>
		</>
	);
};