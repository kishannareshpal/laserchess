import useImage from "use-image";
import { Group, Image } from "react-konva";
import type { Cell as TCell } from "@/models/models/cell";
import { PositionHelper } from "@/models/helpers/position-helper";
import { PieceHelper } from "@/models/helpers/piece-helper";
import { game$ } from "@/utils/store/game$";
import { LocationHelper } from "@/models/helpers/location-helper";
import { use$ } from "@legendapp/state/react";
import { CellHelper } from "@/models/helpers/cell-helper";
import type { Position } from "@/models/models/position";
import type { KonvaEventObject, NodeConfig } from "konva/lib/Node";
import type { GridLayerRef } from "@/types";
import { CellUIHelper } from "@/models/helpers/cell-ui-helper";
import { cells$ } from "@/utils/store/cells$";
import { Piece } from "./piece";
import { CELL_STROKE_WIDTH, HALF_OF_CELL_STROKE_WIDTH } from "@/constants";

type BoardPieceProps = {
  cell: TCell;
  cellLength: number;
  gridLayerRef: GridLayerRef;
};

export const Cell = ({ cell, cellLength, gridLayerRef }: BoardPieceProps) => {
  // const [pieceImage] = useImage(`https://laserchess.s3.us-east-2.amazonaws.com/pieces/${cell.piece.playerType}-${PieceHelper.getPieceName(cell.piece.type)}.svg`);
  // const turn = use$(game$.turn);

  const initialCellPosition = PositionHelper.fromLocation(
    cell.location,
    cellLength,
    { offset: PositionHelper.fromScalar(HALF_OF_CELL_STROKE_WIDTH) },
  );

  const pieceLength = cellLength - CELL_STROKE_WIDTH;

  // const canInteract = (cell.piece.playerType === turn.player) && turn.phase === 'moving';
  // const canDrag = canInteract && cell.piece.type !== 'l';

  // const keepInBoundsWhileDragging: NodeConfig['dragBoundFunc'] = (currentPosition) => {
  //     // Limit drag to inside the canvas.
  //     const firstCell = cellLength - (cellLength / 2);
  //     const lastColHor = (cellLength * 9) + (cellLength / 2);
  //     const lastColVer = (cellLength * 7) + (cellLength / 2);

  //     // Clamp the x-coordinate
  //     const clampedX = (currentPosition.x > lastColHor) ? lastColHor : (currentPosition.x < firstCell) ? firstCell : currentPosition.x;

  //     // Clamp the y-coordinate
  //     const clampedY = currentPosition.y > lastColVer ? lastColVer : currentPosition.y < firstCell ? firstCell : currentPosition.y;

  //     return {
  //         x: clampedX,
  //         y: clampedY
  //     };
  // }

  // const handleSelection = (event: KonvaEventObject<Event>): void => {
  //     const tappedCellLocation = LocationHelper.fromPosition(event.target.position(), cellLength);
  //     game$.togglePieceAt(tappedCellLocation);
  // }

  return (
    <Group>
      {/*<Piece.Deflector position={initialCellPosition} length={pieceLength} />*/}
      {/*<Piece.Defender position={initialCellPosition} length={pieceLength} />*/}
      {/*<Piece.Switch position={initialCellPosition} length={pieceLength} />*/}
      {/*<Piece.Laser position={initialCellPosition} length={pieceLength} />*/}
      <Piece.King position={initialCellPosition} length={pieceLength} />
    </Group>

    // <Image
    //     id={`c-${cell.id}`}
    //     image={pieceImage}
    //     x={initialCellPosition.x}
    //     y={initialCellPosition.y}
    //     offset={PositionHelper.fromScalar(cellLength / 2)}
    //     width={cellLength}
    //     height={cellLength}
    //     listening={canInteract}
    //     rotation={cell.piece.orientation}
    //     draggable={canDrag}
    //     onMouseDown={(e) => {
    //         CellUIHelper.setCursorStyle(e.target, 'grabbing');
    //     }}
    //     onMouseUp={(e) => {
    //         CellUIHelper.setCursorStyle(e.target, 'grab');
    //     }}
    //     onMouseOver={(e) => {
    //         CellUIHelper.setCursorStyle(e.target, 'grab');
    //     }}
    //     onMouseOut={(e) => {
    //         CellUIHelper.setCursorStyle(e.target, 'default');
    //     }}
    //     onTap={handleSelection}
    //     onClick={handleSelection}
    //     dragBoundFunc={keepInBoundsWhileDragging}
    //     onDragStart={(e) => {
    //         // Ensure multiple pieces can't be dragged at once
    //         if (cells$.isAnyPieceBeingDragged()) {
    //             return;
    //         }

    //         const sourceCellPosition = e.target.position();
    //         cells$.setCurrentDraggingPieceSourcePosition(sourceCellPosition);

    //         // Handle piece dragging:
    //         const sourceCellLocation = LocationHelper.fromPosition(sourceCellPosition, cellLength);
    //         game$.togglePieceAt(sourceCellLocation, { forcedState: true })

    //         // Move the draging cell's layer to the top, so it doesn't get overlayed
    //         // by other cells while dragging.
    //         e.target.moveToTop();

    //         // Change the cursor type on the cell's container to have the "grabbing" hand style
    //         CellUIHelper.setCursorStyle(e.target, 'grabbing');
    //     }}
    //     onDragEnd={(e) => {
    //         if (!cells$.isAnyPieceBeingDragged()) {
    //             return;
    //         }

    //         const sourceCellPosition: Position = cells$.currentDraggingPieceSourcePosition.peek();

    //         // The end position refers to the exact position where the pointer (mouse or finger) when finished dragging
    //         const endPosition: Position = e.target.getPosition();
    //         const sourceCellLocation = LocationHelper.fromPosition(sourceCellPosition, cellLength);
    //         const sourceCell: TCell = {
    //             id: cell.id,
    //             location: structuredClone(
    //                 // Remark: we can't use cell.location because it changes on drag+drop,
    //                 // so we use the previously recorded cellPlacement.position instead
    //                 sourceCellLocation
    //                 // cellPlacement.location
    //             ),
    //             type: cell.type,
    //             piece: structuredClone(cell.piece)
    //         }
    //         const targetCell: TCell = CellHelper.getCellAt(
    //             game$.cellGrid.peek(),
    //             LocationHelper.fromPosition(endPosition, cellLength)
    //         );
    //         const targetCellPosition = PositionHelper.fromLocation(
    //             targetCell.location,
    //             cellLength,
    //             { offset: PositionHelper.fromScalar(cellLength / 2) }
    //         );

    //         CellUIHelper.performMovement({
    //             source: {
    //                 cell: sourceCell,
    //                 position: sourceCellPosition
    //             },
    //             target: {
    //                 cell: targetCell,
    //                 position: targetCellPosition
    //             },
    //             gridLayerRef
    //         });

    //         CellUIHelper.setCursorStyle(e.target, 'grab');
    //         cells$.setCurrentDraggingPieceSourcePosition(undefined);
    //     }}
    // />
  );
};
