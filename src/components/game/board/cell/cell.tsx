import type { Cell as TCell } from "@/models/cell";
import { PositionHelper } from "@/models/helpers/position-helper";
import { game$ } from "@/lib/store/game$";
import { LocationHelper } from "@/models/helpers/location-helper";
import { use$ } from "@legendapp/state/react";
import { CellHelper } from "@/models/helpers/cell-helper";
import type { Position } from "@/models/position";
import type { GridLayerRef } from "@/types";
import { CellUIHelper } from "@/models/helpers/cell-ui-helper";
import { Piece } from "./piece";
import { GridLayerHelper } from "@/models/helpers/grid-layer-helper";
import { Group } from "react-konva";
import { Portal } from "react-konva-utils";
import { useState } from "react";

type BoardPieceProps = {
    cell: TCell;
    cellLength: number;
    gridLayerRef: GridLayerRef;
};

export const Cell = ({ cell, cellLength, gridLayerRef }: BoardPieceProps) => {
    const [isPieceBeingDragged, setIsPieceBeingDragged] = useState<boolean>(false);

    const cellPosition = PositionHelper.fromLocation(cell.location, cellLength);
    const turn = use$(game$.turn);
    const enabled = turn.phase === "moving" && cell.piece?.playerType === turn.player;

    const handleSelection = (): void => {
        const cellNode = GridLayerHelper.findCellNodeById(cell.id, gridLayerRef);
        const cellLocation = LocationHelper.fromPosition(
            cellNode.position(),
            cellLength,
        );

        game$.togglePieceAt(cellLocation);
    };

    return (
        <Group id={`cg-${cell.id}`}>
            {CellHelper.hasPiece(cell) ? (
                <Portal selector="#top-layer" enabled={isPieceBeingDragged}>
                    <Piece.Factory
                        id={`cp-${cell.id}`}
                        piece={cell.piece}
                        length={cellLength}
                        position={cellPosition}
                        enabled={enabled}
                        onSelect={handleSelection}
                        onDragStart={(e) => {
                            setIsPieceBeingDragged(true);

                            // Ensure multiple pieces can't be dragged at once
                            if (game$.isAnyPieceBeingDragged()) {
                                return;
                            }

                            const sourceCellPosition = e.target.position();
                            game$.startDraggingPieceAt(sourceCellPosition);
                            // Handle piece dragging:
                            const sourceCellLocation = LocationHelper.fromPosition(
                                sourceCellPosition,
                                cellLength,
                            );
                            game$.togglePieceAt(sourceCellLocation, { forcedState: true });

                            // Change the cursor type on the cell's container to have the "grabbing" hand style
                            CellUIHelper.setCursorStyle(e.target, "grabbing");
                        }}
                        onDragEnd={(e) => {
                            setIsPieceBeingDragged(false);

                            if (!game$.isAnyPieceBeingDragged()) {
                                return;
                            }
                            const sourceCellPosition: Position = game$.turn.draggingPieceSourcePosition.peek();

                            // The end position refers to the exact position where the pointer (mouse or finger) when finished dragging
                            const endPosition: Position = e.target.getPosition();
                            const sourceCellLocation = LocationHelper.fromPosition(
                                sourceCellPosition,
                                cellLength,
                            );
                            const sourceCell: TCell = {
                                id: cell.id,
                                location: structuredClone(
                                    // Remark: we can't use cell.location because it changes on drag+drop,
                                    // so we use the previously recorded sourceCellLocation instead
                                    sourceCellLocation,
                                ),
                                type: cell.type,
                                piece: structuredClone(cell.piece),
                            };
                            const targetCell: TCell = CellHelper.getCellAt(
                                game$.cellGrid.peek(),
                                LocationHelper.fromPosition(endPosition, cellLength),
                            );
                            const targetCellPosition = PositionHelper.fromLocation(
                                targetCell.location,
                                cellLength,
                                { offset: PositionHelper.fromScalar(cellLength / 2) },
                            );
                            CellUIHelper.performMovement({
                                source: {
                                    cell: sourceCell,
                                    position: sourceCellPosition,
                                },
                                target: {
                                    cell: targetCell,
                                    position: targetCellPosition,
                                },
                                gridLayerRef,
                            });
                            CellUIHelper.setCursorStyle(e.target, "grab");
                            game$.stopDraggingPiece();
                        }}
                    />
                </Portal>
            ) : null}
        </Group>
    );
};
