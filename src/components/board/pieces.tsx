
import { LocationHelper } from "@/models/helpers/location-helper";
import { CellHelper } from "@/models/helpers/cell-helper";
import { Piece } from "./piece";
import type { CellGrid } from "@/models/models/cell";
import type { JSX } from "react";

type PiecesProps = {
    cellGrid: CellGrid,
    cellLength: number
}

export const Pieces = ({
    cellGrid,
    cellLength
}: PiecesProps) => {
    const render = (): JSX.Element[] => {
		const pieceElements: JSX.Element[] = [];

		cellGrid.forEach((row) => {
			row.forEach((cell) => {
				if (!CellHelper.hasPiece(cell)) {
					return;
				}

				pieceElements.push(
					<Piece
						key={LocationHelper.toAN(cell.location)}
						cell={cell}
						cellLength={cellLength}
					/>
				)
			});
		});

		return pieceElements;
	}

    return render();
}