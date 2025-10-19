import { CELL_HIGHLIGHT_STROKE_WIDTH } from "@/constants"
import { PositionHelper } from "@/models/helpers/position-helper"
import { game$ } from "@/lib/store/game$"
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
            id="p-highlight"
            x={position.x}
            y={position.y}
            width={cellLength}
            height={cellLength}
            stroke="white"
            listening={false}
            strokeWidth={CELL_HIGHLIGHT_STROKE_WIDTH}
            lineCap="round"
            lineJoin="round"
        />
    )
})