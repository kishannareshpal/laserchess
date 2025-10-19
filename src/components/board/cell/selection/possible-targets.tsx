import { MovementHelper } from "@/models/helpers/movement-helper"
import { game$ } from "@/lib/store/game$"
import { observer } from "@legendapp/state/react"
import { use$ } from "@legendapp/state/react"
import { Group } from "react-konva"
import type { Movement } from "@/models/movement"
import type { GridLayerRef } from "@/types"
import { CellUIHelper } from "@/models/helpers/cell-ui-helper"
import { CellHelper } from "@/models/helpers/cell-helper"
import { PositionHelper } from "@/models/helpers/position-helper"
import { Target } from "./target"

type PossibleTargetsProps = {
    cellLength: number,
    gridLayerRef: GridLayerRef
}

export const PossibleTargets = observer(({
    cellLength,
    gridLayerRef
}: PossibleTargetsProps) => {
    const cellGrid = use$(game$.cellGrid);
    const selectedPieceLocation = use$(game$.turn.selectedPieceLocation);

    if (!selectedPieceLocation) {
        return null;
    }

    const possibleMovements = MovementHelper.getMovesForPieceAt(
        selectedPieceLocation,
        cellGrid
    )

    const handlePress = (movement: Movement) => {
        const sourceCell = CellHelper.getCellAt(cellGrid, game$.turn.selectedPieceLocation.peek());
        const sourceCellPosition = PositionHelper.fromLocation(movement.sourceCellLocation, cellLength, { centered: true });

        const targetCell = CellHelper.getCellAt(cellGrid, movement.targetCellLocation);
        const targetCellPosition = PositionHelper.fromLocation(movement.targetCellLocation, cellLength, { centered: true });

        CellUIHelper.performMovement({
            source: {
                cell: sourceCell,
                position: sourceCellPosition
            },
            target: {
                cell: targetCell,
                position: targetCellPosition
            },
            gridLayerRef
        })
    }

    return (
        <Group id="pt-group">
            {possibleMovements.map((movement) => (
                <Target
                    key={`mt-${MovementHelper.toAN(movement)}`}
                    cellLength={cellLength}
                    movement={movement}
                    onPress={() => handlePress(movement)}
                />
            ))}
        </Group>
    )
})