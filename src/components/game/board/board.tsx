import { Stage } from "react-konva";
import { Layers } from "./layers";
import type { CellGrid } from "@/models/cell";
import { BOARD_STROKE_WIDTH } from "@/constants";
import { useTheme } from "@/lib/hooks/use-theme";

type BoardProps = {
    width: number,
    height: number,
    cellLength: number,
    cellGrid: CellGrid;
}

export const Board = ({
    width,
    height,
    cellLength,
    cellGrid
}: BoardProps) => {
    const theme = useTheme();

    return (
        <Stage
            width={width}
            height={height}
            className="rounded-3xl z-1 overflow-hidden"
            style={{
                background: theme.colors.board.background,
                borderWidth: BOARD_STROKE_WIDTH,
                borderColor: theme.colors.board.outline
            }}
        >
            <Layers width={width} height={height} cellGrid={cellGrid} cellLength={cellLength} />
        </Stage>
    );
}