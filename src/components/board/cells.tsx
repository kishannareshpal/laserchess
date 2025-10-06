
import { LocationHelper } from "@/models/helpers/location-helper";
import { CellHelper } from "@/models/helpers/cell-helper";
import { Cell } from "./cell";
import type { CellGrid } from "@/models/models/cell";
import { type RefObject } from "react";
import type Konva from "konva";

type PiecesProps = {
    cellGrid: CellGrid,
    cellLength: number,
    gridLayerRef: RefObject<Konva.Layer>,
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
							key={LocationHelper.toAN(cell.location)}
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