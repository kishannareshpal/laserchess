import type { OrientationDegrees, PieceType, PlayerType } from "@/types"

export type Piece = {
    playerType: PlayerType,
    type: PieceType,
    orientation: OrientationDegrees,
}