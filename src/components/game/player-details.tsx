import { game$ } from "@/lib/store/game$"
import { PlayerHelper } from "@/models/helpers/player-helper"
import type { PlayerType } from "@/types"
import { observer, use$ } from "@legendapp/state/react"
import { UserIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { animate, JSAnimation, splitText, stagger } from "animejs";

export type PlayerDetailsProps = {
    playerType: PlayerType
}

export const PlayerDetails = observer(({ playerType }: PlayerDetailsProps) => {
    const turnPlayer = use$(game$.turn.player);

    const playerName = PlayerHelper.humanize(playerType);
    const isPlayerTurn = turnPlayer === playerType;

    const animationRef = useRef<JSAnimation | undefined>(undefined);
    const turnIndicatorTextRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const { words } = splitText(turnIndicatorTextRef.current, { words: true });

        animationRef.current = animate(words, {
            y: [
                {
                    from: '-25%',
                    to: '0'
                },
            ],
            opacity: [
                {
                    from: 0,
                    to: 1
                },
            ],
            autoplay: true,
            duration: 750,
            ease: 'inSine',
            delay: stagger(50),
            loop: false,
        });
    }, [turnPlayer]);

    useEffect(() => {
        animationRef.current.restart();
    }, [turnPlayer]);

    return (
        <div className="flex justify-center items-center gap-2 rounded-lg">
            <UserIcon />
            <div className="flex flex-col relative justify-center">
                {/*
                      Remarks:
                        The duplicated player name below is a simple layout hack.
                        - It ensures the container always reserves space for two lines of text,
                        so when "Your turn" appears or disappears, the layout doesn't jump or shift.
                */}

                <div className="absolute" style={{ opacity: isPlayerTurn ? 0 : 1 }}>
                    <p className="text-nowrap">{playerName}</p>
                </div>

                <div style={{ opacity: isPlayerTurn ? 1 : 0 }}>
                    <p className="flex">{playerName}</p>
                    <p ref={turnIndicatorTextRef} className="text-sm text-white/75">
                        Your turn
                    </p>
                </div>
            </div>
        </div>
    )
});