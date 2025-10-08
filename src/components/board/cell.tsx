import Konva from "konva";
import useImage from "use-image";
import { Image } from "react-konva";
import type { Cell as TCell } from "@/models/models/cell";
import { PositionHelper } from "@/models/helpers/position-helper";
import { PieceHelper } from "@/models/helpers/piece-helper";
import { game$ } from "@/utils/store/game";
import { LocationHelper } from "@/models/helpers/location-helper";
import { use$ } from "@legendapp/state/react";
import { MovementHelper } from "@/models/helpers/movement-helper";
import { CellHelper } from "@/models/helpers/cell-helper";
import { useRef, useState, type RefObject } from "react";
import type { Position } from "@/models/models/position";
import type { Location } from "@/models/models/location";
import { PIECE_MOVEMENT_ANIMATION_DURATION, PIECE_MOVEMENT_ANIMATION_EASING_FN } from "@/constants";
import { LaserHelper } from "@/models/helpers/laser-helper";

type BoardPieceProps = {
    cell: TCell,
    cellLength: number,
    gridLayerRef: RefObject<Konva.Layer>
}

export const Cell = (
    {
        cell,
        cellLength,
        gridLayerRef
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
    const turn = use$(game$.turn);
    
    const draggingCellSourcePositionRef = useRef<Position | null>(null);
    const canDrag = cell.piece.type !== 'l' && (cell.piece.playerType === turn.player) && turn.phase === 'moving';

    const handlePieceSelection = (): void => {
        game$.togglePieceAt(cellPlacement.location);

        LaserHelper.computeLaserPath('blue', game$.cellGrid.peek());
    }

    return (
        <Image
            id={`c-${cell.id}`}
            image={pieceImage}
            x={cellPlacement.position.x}
            y={cellPlacement.position.y}
            offset={PositionHelper.fromScalar(cellLength / 2)}
            width={cellLength}
            height={cellLength}
            rotation={cell.piece.orientation}
            draggable={canDrag}
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
                const sourceCell: TCell = {
                    id: cell.id,
                    location: structuredClone(cellPlacement.location), // we can't use cell.location because it changes on drag+drop
                    type: cell.type,
                    piece: cell.piece
                }
                const targetCell: TCell = CellHelper.getCellAt(
                    game$.cellGrid.peek(), 
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
                    duration: PIECE_MOVEMENT_ANIMATION_DURATION,
                    easing: PIECE_MOVEMENT_ANIMATION_EASING_FN
                });

                if (movement.type === 'special') {
                    // Special move involves swapping the source and target pieces.
                    // - We've already moved the source cell to the target position
                    // - We're now need to move the target piece to the source piece's location
                    const targetCellNode = gridLayerRef.current.findOne(`#c-${targetCell.id}`);
                    targetCellNode.to({
                        x: sourceCellPosition.x,
                        y: sourceCellPosition.y,
                        duration: PIECE_MOVEMENT_ANIMATION_DURATION,
                        easing: PIECE_MOVEMENT_ANIMATION_EASING_FN
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