import type { ThemeConfig } from "./types";

export const classicTheme: ThemeConfig = {
    colors: {
        page: {
            background: '#FCEFE3',
            text: '#000000'
        },
        board: {
            background: '#ffffff80',
            divider: '#000',
            outline: '#000',
        },
        controls: {
            surface: '#000000',
            text: '#ffffff',
        },
        cell: {
            reserved: {
                stroke: {
                    'player-one': '#48c8c8ff',
                    'player-two': '#F02D3A'
                }
            },
            selection: {
                highlight: '#00b612ff',
                target: {
                    background: '#43ff56ff',
                    accent: '#000000ff'
                }
            }
        },
        piece: {
            primary: {
                'player-one': "#11E4E4", // Khaki
                'player-two': "#EF3C2D", // Steel Blue
            },
            secondary: {
                'player-one': '#000000',
                'player-two': '#000000'
            },
            stroke: {
                'player-one': "#000000", // Dark Gray
                'player-two': "#000000", // Light Gray
            },
            mirror: {
                'player-one': "#D6FFFD", // OrangeRed
                'player-two': "#FFD6DC", // MediumSeaGreen
            },
            shield: {
                'player-one': "#000000", // Pink
                'player-two': "#161A1D", // Light Blue
            },
        },
    },
}