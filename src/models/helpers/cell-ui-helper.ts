import type { GridLayerRef } from "@/types";
import type { Movement } from "../models/movement";
import type { Position } from "../models/position";
import { MovementHelper } from "./movement-helper";
import type { Cell } from "../models/cell";
import { PIECE_MOVEMENT_ANIMATION_DURATION, PIECE_MOVEMENT_ANIMATION_EASING_FN } from "@/constants";
import { GridLayerHelper } from "./grid-layer-helper";
import { game$ } from "@/utils/store/game$";
import type Konva from "konva";

type PresentMovementOptions = {
    source: {
        cell: Cell,
        position: Position,
    },
    target: {
        cell: Cell,
        position: Position
    },
    gridLayerRef: GridLayerRef
}

export class CellUIHelper {
    static setCursorStyle(node: Konva.Node, cursorStyle: CSSStyleDeclaration['cursor']): void {
        const stageContainer = node.getStage().container();
        stageContainer.style.cursor = cursorStyle;
    }

    static performMovement(options: PresentMovementOptions): Movement {
        const sourceCellNode = GridLayerHelper.findCellNodeById(options.source.cell.id, options.gridLayerRef);
        const checkedMovement = MovementHelper.checkMove(options.source.cell, options.target.cell);

        if (checkedMovement.type === 'invalid') {
            // Revert the source cell back to its original place if it was moved (e.g. during a drag+drop operation)
            sourceCellNode.to({
                x: options.source.position.x,
                y: options.source.position.y,
                duration: PIECE_MOVEMENT_ANIMATION_DURATION,
                easing: PIECE_MOVEMENT_ANIMATION_EASING_FN
            });

            return checkedMovement;
        }

        const targetCellNode = GridLayerHelper.findCellNodeById(options.target.cell.id, options.gridLayerRef);

        // Move the source piece to the target location
        sourceCellNode.to({
            x: options.target.position.x,
            y: options.target.position.y,
            duration: PIECE_MOVEMENT_ANIMATION_DURATION,
            easing: PIECE_MOVEMENT_ANIMATION_EASING_FN
        });

        if (checkedMovement.type === 'special') {
            // Special move involves swapping the source and target pieces.
            // - We've already moved the source cell to the target position
            // - We're now need to move the target piece to the source piece's location
            targetCellNode.to({
                x: options.source.position.x,
                y: options.source.position.y,
                duration: PIECE_MOVEMENT_ANIMATION_DURATION,
                easing: PIECE_MOVEMENT_ANIMATION_EASING_FN
            });
        }

        game$.recordTurnMovement(checkedMovement);
        return checkedMovement;
    }
}