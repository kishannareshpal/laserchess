import { JSAnimation, animate, splitText, stagger } from "animejs";
import { useEffect, useRef } from "react"

import { PlayerHelper } from "@/models/helpers/player-helper"
import type { PlayerType } from "@/types"
import { UserIcon } from "lucide-react"
import { game$ } from "@/lib/store/game$"
import { useTheme } from "@/lib/hooks/use-theme"
import { useValue } from "@legendapp/state/react"

export type PlayerDetailsProps = {
    playerType: PlayerType
}

export const PlayerDetails = ({ playerType }: PlayerDetailsProps) => {
    const theme = useTheme();

    const turnPlayer = useValue(game$.turn.player);

    const playerName = PlayerHelper.humanize(playerType);
    const isPlayerTurn = turnPlayer === playerType;

    const animationRef = useRef<JSAnimation | undefined>(undefined);
    const turnIndicatorTextRef = useRef<HTMLParagraphElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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
            autoplay: false,
            ease: 'inSine',
            duration: 300,
            delay: stagger(50),
            loop: false,
        });
    }, []);

    useEffect(() => {
        animationRef.current.restart();
    }, [turnPlayer]);

    return (
        <div className="flex justify-center items-center gap-2 rounded-lg" style={{ color: theme.colors.page.text }}>
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

                <div ref={containerRef} style={{ opacity: isPlayerTurn ? 1 : 0 }}>
                    <p className="flex font-bold">{playerName}</p>
                    <p ref={turnIndicatorTextRef} className="text-sm" style={{ opacity: .75 }}>
                        Your turn
                    </p>
                </div>
            </div>
        </div>
    )
};