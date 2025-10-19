import type { MovementType } from "@/types"
import type { Location } from "./location"

export type Movement = {
    type: MovementType,
    sourceCellLocation: Location,
    targetCellLocation: Location
}