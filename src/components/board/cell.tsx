import type { Cell as TCell } from "@/models/models/cell";
import { PositionHelper } from "@/models/helpers/position-helper";
import { game$ } from "@/utils/store/game$";
import { LocationHelper } from "@/models/helpers/location-helper";
import { use$ } from "@legendapp/state/react";
import { CellHelper } from "@/models/helpers/cell-helper";
import type { Position } from "@/models/models/position";
import type { GridLayerRef } from "@/types";
import { CellUIHelper } from "@/models/helpers/cell-ui-helper";
import { cells$ } from "@/utils/store/cells$";
import { Piece } from "./piece";
import { HALF_OF_CELL_STROKE_WIDTH } from "@/constants";
import { GridLayerHelper } from "@/models/helpers/grid-layer-helper";

type BoardPieceProps = {
  cell: TCell;
  cellLength: number;
  gridLayerRef: GridLayerRef;
};

export const Cell = ({ cell, cellLength, gridLayerRef }: BoardPieceProps) => {
  const cellId = `c-${cell.id}`;
  const turn = use$(game$.turn);

  const piecePosition = PositionHelper.fromLocation(cell.location, cellLength, {
    offset: PositionHelper.fromScalar(HALF_OF_CELL_STROKE_WIDTH),
  });

  const enabled =
    cell.piece.playerType === turn.player && turn.phase === "moving";
  // const canDrag = canInteract && cell.piece.type !== "l";

  const handleSelection = (): void => {
    const cellNode = GridLayerHelper.findCellNodeById(cell.id, gridLayerRef);
    const cellLocation = LocationHelper.fromPosition(
      cellNode.position(),
      cellLength,
    );

    game$.togglePieceAt(cellLocation);
  };

  return (
    <Piece.Factory
      id={cellId}
      piece={cell.piece}
      length={cellLength}
      position={piecePosition}
      enabled={enabled}
      onSelect={handleSelection}
      onDragStart={(e) => {
        // Ensure multiple pieces can't be dragged at once
        if (cells$.isAnyPieceBeingDragged()) {
          return;
        }
        const sourceCellPosition = e.target.position();
        cells$.setCurrentDraggingPieceSourcePosition(sourceCellPosition);
        // Handle piece dragging:
        const sourceCellLocation = LocationHelper.fromPosition(
          sourceCellPosition,
          cellLength,
        );
        game$.togglePieceAt(sourceCellLocation, { forcedState: true });
        // Move the draging cell's layer to the top, so it doesn't get overlayed
        // by other cells while dragging.
        e.target.moveToTop();
        // Change the cursor type on the cell's container to have the "grabbing" hand style
        CellUIHelper.setCursorStyle(e.target, "grabbing");
      }}
      onDragEnd={(e) => {
        if (!cells$.isAnyPieceBeingDragged()) {
          return;
        }
        const sourceCellPosition: Position =
          cells$.currentDraggingPieceSourcePosition.peek();
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
        cells$.setCurrentDraggingPieceSourcePosition(undefined);
      }}
    />
  );
};
