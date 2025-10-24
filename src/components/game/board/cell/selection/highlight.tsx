import { CELL_HIGHLIGHT_STROKE_WIDTH } from "@/constants"
import { PositionHelper } from "@/models/helpers/position-helper"
import { game$ } from "@/lib/store/game$"
import { useValue } from "@legendapp/state/react"
import { Rect } from "react-konva"
import { useTheme } from "@/lib/hooks/use-theme"

type HighlightProps = {
    cellLength: number
}

export const Highlight = ({
    cellLength
}: HighlightProps) => {
    const selectedPieceLocation = useValue(game$.turn.selectedPieceLocation);
    const theme = useTheme();

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
            stroke={theme.colors.cell.selection.highlight}
            listening={false}
            strokeWidth={CELL_HIGHLIGHT_STROKE_WIDTH}
            lineCap="round"
            lineJoin="round"
        />
    )
}