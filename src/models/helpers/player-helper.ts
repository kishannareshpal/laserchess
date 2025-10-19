import type { PlayerType } from "@/types";

export class PlayerHelper {
    static humanize(playerType: PlayerType): string {
        return playerType === 'player-one' ? 'Player one' : 'Player two'
    }
}