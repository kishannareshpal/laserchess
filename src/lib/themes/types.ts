import type { PlayerType } from "@/types";

export type ThemeValueByPlayerType<ValueType> = Record<PlayerType, ValueType>

export type ThemeConfig = {
    colors: {
        page: {
            background: string,
            text: string
        },
        board: {
            background: string,
            divider: string,
            outline: string,
        },
        controls: {
            surface: string,
            text: string,
        },
        cell: {
            reserved: {
                stroke: ThemeValueByPlayerType<string>
            },
            selection: {
                highlight: string,
                target: {
                    background: string,
                    accent: string
                }
            }
        },
        piece: {
            primary: ThemeValueByPlayerType<string>;
            secondary: ThemeValueByPlayerType<string>;
            stroke: ThemeValueByPlayerType<string>;
            mirror: ThemeValueByPlayerType<string>;
            shield: ThemeValueByPlayerType<string>;
        };
    };
};