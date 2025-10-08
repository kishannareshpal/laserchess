import { PositionHelper } from "@/models/helpers/position-helper"
import { game$ } from "@/utils/store/game$"
import { observer } from "@legendapp/state/react"
import { use$ } from "@legendapp/state/react"
import { Rect } from "react-konva"

type HighlightProps = {
    cellLength: number
}

export const Highlight = observer(({
    cellLength
}: HighlightProps) => {
    const selectedPieceLocation = use$(game$.turn.selectedPieceLocation);

    if (!selectedPieceLocation) {
        return null;
    }

    const position = PositionHelper.fromLocation(selectedPieceLocation, cellLength);

    return (
        <Rect
            id="selected-piece-highlight"
            x={position.x}
            y={position.y}
            width={cellLength}
            height={cellLength}
            stroke={"#f8f32b"}
            cornerRadius={8}
            listening={false}
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
        />
    )
})