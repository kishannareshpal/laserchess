
import { LocationHelper } from "@/models/helpers/location-helper";
import { CellHelper } from "@/models/helpers/cell-helper";
import { Piece } from "./piece";
import type { CellGrid } from "@/models/models/cell";
import { useState, type JSX, type RefObject } from "react";
import type Konva from "konva";

type PiecesProps = {
    cellGrid: CellGrid,
    cellLength: number,
    gridLayerRef: RefObject<Konva.Layer>,
}

export const Pieces = ({
    cellGrid,
    cellLength,
    gridLayerRef
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
                        gridLayerRef={gridLayerRef}
					/>
				)
			});
		});

		return pieceElements;
	}

    return render();
}