import type { Position } from "@/models/models/position";
import type { CellType } from "@/types";

export type CellBackgroundProps = {
    cellType: CellType;
    position: Position;
    length: number;
}