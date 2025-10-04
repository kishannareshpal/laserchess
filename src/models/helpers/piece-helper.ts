import type { PieceName, PieceType, PlayerType } from "@/types";

export class PieceHelper {
    /**
     * Determine the player (red or blue) a piece belongs to based on its type notation.
     * 
     * @param pieceType the type notation of the piece. Lowercase letters represent red pieces, while uppercase letters represent blue pieces.
     */
    static determinePiecePlayerType(pieceType: PieceType | Uppercase<PieceType>): PlayerType {
        return pieceType === pieceType.toLowerCase() ? 'red' : 'blue';
    }

    /**
     * Determine the player (red or blue) a piece belongs to based on its type notation.
     * 
     * @param pieceType the type notation of the piece. Lowercase letters represent red pieces, while uppercase letters represent blue pieces.
     */
    static determinePieceType(pieceType: PieceType | Uppercase<PieceType>): PieceType {
        return pieceType.toLowerCase() as PieceType;
    }

    /**
     * Get the name of the piece for the given piece type.

     * @example "king", "laser", "defender", "deflector" and "switch"
     */
    static getPieceName(pieceType: PieceType): PieceName {
        switch (pieceType) {
            case 'k':
                return "king";

            case 'l':
                return "laser";

            case 'd':
                return "defender";

            case 'b':
                return "deflector";

            case 's':
                return "switch";
        }
    }
}