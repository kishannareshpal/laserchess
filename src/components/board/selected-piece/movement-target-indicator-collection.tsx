import { MovementHelper } from "@/models/helpers/movement-helper"
import { game$ } from "@/utils/store/game"
import { observer } from "@legendapp/state/react"
import { use$ } from "@legendapp/state/react"
import { Group } from "react-konva"
import { MovementTargetIndicator } from "./movement-target-indicator"

type MovementTargetIndicatorCollectionProps = {
    cellLength: number
}

export const MovementTargetIndicatorCollection = observer(({
    cellLength
}: MovementTargetIndicatorCollectionProps) => {
    const selectedPieceLocation = use$(game$.selectedPieceLocation);

    const renderCollection = () => {
        if (!selectedPieceLocation) {
            return null;
        }

        const possibleMovements = MovementHelper.getMovesForPieceAt(selectedPieceLocation, game$.board.cellGrid.peek());
        return possibleMovements.map((movement) => {
            return (
                <MovementTargetIndicator
                    key={`mt-${MovementHelper.toAN(movement)}`}
                    cellLength={cellLength}
                    movement={movement}
                    onPress={() => {
						// Board.presentPieceMovement(reference, move.serialize(), cellSize);
						// dispatch(unselectPiece()); // unselect the piece
						// // Apply the ai movement on the board state
						// setTimeout(() => {
						// 	dispatch(applyMovement({ movement: movement.serialize() }));
						// }, 400);
					}}
                />
            )
        })
    }

    return (
        <Group>
            {renderCollection()}
        </Group>
    )
})