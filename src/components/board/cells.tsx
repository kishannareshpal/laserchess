
import { CellHelper } from "@/models/helpers/cell-helper";
import { Cell } from "./cell";
import type { CellGrid } from "@/models/models/cell";
import type { GridLayerRef } from "@/types";

type PiecesProps = {
    cellGrid: CellGrid,
    cellLength: number,
    gridLayerRef: GridLayerRef
}

export const Cells = ({
    cellGrid,
    cellLength,
    gridLayerRef
}: PiecesProps) => {
    return (
		<>
			{cellGrid.map((row) => {
				return row.map((cell) => {
					if (!CellHelper.hasPiece(cell)) {
						return null;
					}

					return (
						<Cell
							key={cell.id}
							cell={cell}
							cellLength={cellLength}
							gridLayerRef={gridLayerRef}
						/>
					)
				});
			})}
		</>
	);
}