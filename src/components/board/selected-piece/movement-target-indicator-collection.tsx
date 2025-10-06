import { MovementHelper } from "@/models/helpers/movement-helper"
import { game$ } from "@/utils/store/game"
import { observer } from "@legendapp/state/react"
import { use$ } from "@legendapp/state/react"
import { Group } from "react-konva"
import { MovementTargetIndicator } from "./movement-target-indicator"
import type { Movement } from "@/models/models/movement"

type MovementTargetIndicatorCollectionProps = {
    cellLength: number
}

export const MovementTargetIndicatorCollection = observer(({
    cellLength
}: MovementTargetIndicatorCollectionProps) => {
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
    }

    return (
        <Group id="movement-target-collection">
            {possibleMovements.map((movement) => (
                <MovementTargetIndicator
                    key={`mt-${MovementHelper.toAN(movement)}`}
                    cellLength={cellLength}
                    movement={movement}
                    onPress={() => handlePress(movement)}
                />
            ))}
        </Group>
    )
})