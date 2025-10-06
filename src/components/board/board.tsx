import { Stage } from "react-konva";
import { BoardLayer } from "./layer";
import type { Size } from "@/models/models/size";
import { SizeHelper } from "@/models/helpers/size-helper";
import type { CellGrid } from "@/models/models/cell";

const BOARD_LENGTH: number = 500;
const BOARD_SIZE: Size = SizeHelper.square(BOARD_LENGTH);
const CELL_LENGTH = BOARD_LENGTH / 10;

type BoardProps = {
    cellGrid: CellGrid;
}

export const Board = ({ cellGrid }: BoardProps) => {
    return (
        <Stage width={BOARD_SIZE.width} height={BOARD_SIZE.height} className="border-2">
            <BoardLayer cellGrid={cellGrid} cellLength={CELL_LENGTH} />
        </Stage>
    );
}