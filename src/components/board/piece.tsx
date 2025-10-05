import Konva from "konva";
import useImage from "use-image";
import { Image } from "react-konva";
import type { Cell } from "@/models/models/cell";
import { PositionHelper } from "@/models/helpers/position-helper";
import { PieceHelper } from "@/models/helpers/piece-helper";
import { game$ } from "@/utils/store/game";
import { LocationHelper } from "@/models/helpers/location-helper";
import { use$ } from "@legendapp/state/react";
import { MovementHelper } from "@/models/helpers/movement-helper";
import { CellHelper } from "@/models/helpers/cell-helper";
import { useRef, useState } from "react";
import type { Position } from "@/models/models/position";
import type { Location } from "@/models/models/location";

/**
 * The duration of the animation of a piece movement.
 */
const MOVE_ANIMATION_DURATION = 0.332 as const;

/**
 * @constant
 * The easing of the tween for any piece movement
 */
const MOVE_ANIMATION_EASING_FN = Konva.Easings.BackEaseOut;

type BoardPieceProps = {
    cell: Cell,
    cellLength: number,
}

export const Piece = (
    {
        cell,
        cellLength
    }: BoardPieceProps
) => {
    const [pieceImage] = useImage(`https://laserchess.s3.us-east-2.amazonaws.com/pieces/${cell.piece.playerType}-${PieceHelper.getPieceName(cell.piece.type)}.svg`);
    const [cellPlacement, setCellPlacement] = useState<{ location: Location, position: Position }>({
        location: cell.location,
        position: PositionHelper.fromLocation(
            cell.location, 
            cellLength, 
            { centered: true }
        )
    })
    const currentPlayer = use$(game$.turn.player);
    
    const draggingCellSourcePositionRef = useRef<Position | null>(null);
    const isDraggable = cell.piece.type !== 'l';
    const canDrag = isDraggable && (cell.piece.playerType === currentPlayer) // && (!movementIsLocked)

    const handlePieceSelection = (): void => {
        game$.togglePieceAt(cellPlacement.location);
    }

    return (
        <Image
            id={LocationHelper.toAN(cell.location)}
            image={pieceImage}
            x={cellPlacement.position.x}
            y={cellPlacement.position.y}
            offset={PositionHelper.fromScalar(cellLength / 2)}
            width={cellLength}
            height={cellLength}
            rotation={cell.piece.orientation}
            draggable={isDraggable}
            onMouseEnter={(e) => {
                const container = e.target.getStage().container();
                container.style.cursor = "grab";
            }}
            onMouseLeave={(e) => {
                const container = e.target.getStage().container();
                container.style.cursor = "default";
            }}
            onTap={handlePieceSelection}
            onClick={handlePieceSelection}
            listening={canDrag}
            dragBoundFunc={(currentPosition) => {
                // Limit drag to inside the canvas.
                const firstCell = cellLength - (cellLength / 2);
                const lastColHor = (cellLength * 9) + (cellLength / 2);
                const lastColVer = (cellLength * 7) + (cellLength / 2);

                // Clamp the x-coordinate
                const clampedX = (currentPosition.x > lastColHor) ? lastColHor : (currentPosition.x < firstCell) ? firstCell : currentPosition.x;

                // Clamp the y-coordinate
                const clampedY = currentPosition.y > lastColVer ? lastColVer : currentPosition.y < firstCell ? firstCell : currentPosition.y;

                return { 
                    x: clampedX, 
                    y: clampedY 
                };
            }}
            onDragStart={(e) => {
                if (draggingCellSourcePositionRef.current) {
                    // Prevent drag of multiple pieces at the same time
                    return;
                }

                // Handle piece dragging:
                draggingCellSourcePositionRef.current = e.target.position();
                game$.togglePieceAt(cellPlacement.location, { forcedState: true })

                // Move the draging cell's layer to the top, so it doesn't get overlayed 
                // by other cells while dragging.
                e.target.moveToTop();

                // Change the cursor type on the cell's container to have the "grabbing" hand style
                const container = e.target.getStage().container();
                container.style.cursor = "grabbing";
            }}
            onDragEnd={(e) => {
                const sourceCellPosition = draggingCellSourcePositionRef.current;
                draggingCellSourcePositionRef.current = null;

                if (!sourceCellPosition) {
                    // Did not initiate a drag
                    return;
                }

                // The target position is exactly where the pointer (mouse or finger) is at the end of dragging
                const endPosition: Position = e.target.getPosition();
                const sourceCell: Cell = {
                    location: structuredClone(cellPlacement.location), // we can't use cell.location because it changes on drag+drop
                    type: cell.type,
                    piece: cell.piece
                }
                const targetCell: Cell = CellHelper.getCellAt(
                    game$.board.cellGrid.peek(), 
                    LocationHelper.fromPosition(endPosition, cellLength)
                );

                const movement = MovementHelper.checkMove(sourceCell, targetCell);

                let targetCellPosition: Position;
                if (movement.type === 'invalid') {
                    // Reset the piece back to where we started dragging it from.
                    targetCellPosition = sourceCellPosition
                } else {
                    targetCellPosition = PositionHelper.fromLocation(targetCell.location, cellLength, {
                        offset: PositionHelper.fromScalar(cellLength / 2)
                    });
                }

                // Move the source piece to the target location
                e.target.to({
                    x: targetCellPosition.x,
                    y: targetCellPosition.y,
                    duration: MOVE_ANIMATION_DURATION,
                    easing: MOVE_ANIMATION_EASING_FN
                });

                if (movement.type === 'special') {
                    // Special move involves swapping the source and target pieces.
                    // - We've already moved the source cell to the target position
                    // - We're now need to move the target piece to the source piece's location
                    const targetCellNode = e.target.parent.findOne(`#${LocationHelper.toAN(movement.targetCellLocation)}`);
                    targetCellNode.to({
                        x: sourceCellPosition.x,
                        y: sourceCellPosition.y,
                        duration: MOVE_ANIMATION_DURATION,
                        easing: MOVE_ANIMATION_EASING_FN
                    });
                }

                if (movement.type !== 'invalid') {
                    setCellPlacement({
                        position: targetCellPosition,
                        location: targetCell.location
                    });
                    game$.recordTurnMovement(movement);
                }

                const container = e.target.getStage().container();
                container.style.cursor = "grab";
            }}
        />
    );
};