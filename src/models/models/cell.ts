import type { CellType } from "@/types"
import type { Piece } from "./piece"
import type { Location } from "./location"

export type Cell = {
    type: CellType,
    location: Location,
    piece?: Piece | null
}

export type CellGrid = Cell[][];