import { PartyPopperIcon } from "lucide-react"
import { PlayerHelper } from "@/models/helpers/player-helper";
import { game$ } from "@/lib/store/game$"
import { useValue } from "@legendapp/state/react"

export const GameOverOverlay = () => {
    const winner = useValue(game$.winner);

    if (!winner) {
        return null;
    }

    const winnerPlayerName: string = PlayerHelper.humanize(winner);

    const handleRestart = (): void => {
        window.location.reload();
    }

    return (
        <div className="flex flex-col gap-5 absolute top-0 bottom-0 right-0 left-0 z-2 rounded-3xl justify-center items-center bg-black/80">
            <div className="flex relative">
                <PartyPopperIcon size={64} className="text-amber-400 blur-md absolute left-0 right-0 top-0 bottom-0" />
                <PartyPopperIcon size={64} className="text-amber-400 left-0 right-0 top-0 bottom-0" />
            </div>


            <p className="text-3xl text-white font-black text-shadow-amber-400/50">{winnerPlayerName} won!</p>


            <button className="text-white underline font-bold cursor-pointer active:scale-95 duration-300" onClick={handleRestart}>
                Play again
            </button>
        </div>
    )
}