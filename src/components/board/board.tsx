import { Stage } from "react-konva";
import { Layers } from "./layers";
import type { CellGrid } from "@/models/models/cell";
import { BOARD_STROKE_WIDTH } from "@/constants";

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
    return (
        <Stage width={width} height={height} className="rounded-3xl border-black bg-white/50" style={{ borderWidth: BOARD_STROKE_WIDTH }}>
            <Layers width={width} height={height} cellGrid={cellGrid} cellLength={cellLength} />
        </Stage>
    );
}