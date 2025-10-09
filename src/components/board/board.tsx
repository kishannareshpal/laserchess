import { Stage } from "react-konva";
import { Layers } from "./layers";
import type { CellGrid } from "@/models/models/cell";

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
        <Stage width={width} height={height} className="border-2">
            <Layers cellGrid={cellGrid} cellLength={cellLength} />
        </Stage>
    );
}