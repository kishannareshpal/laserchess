type ValueByPlayerType<ValueType> = {
  playerOne: ValueType;
  playerTwo: ValueType;
};

type ThemeConfig = {
  colors: {
    pieces: {
      primary: ValueByPlayerType<string>;
      secondary: ValueByPlayerType<string>;
      accent: ValueByPlayerType<string>;
      stroke: ValueByPlayerType<string>;
      mirror: ValueByPlayerType<string>;
      shield: ValueByPlayerType<string>;
    };
  };
};

type Themes = Record<ThemeName, ThemeConfig>

export const themeNames = [
  'classic'
] as const;

export type ThemeName = typeof themeNames[number]

export const themes: Themes = {
  'classic': {
    colors: {
      pieces: {
        primary: {
          playerOne: "#F0E68C", // Khaki
          playerTwo: "#4682B4", // Steel Blue
        },
        secondary: {
          playerOne: "#FFFFFF", // White
          playerTwo: "#000000", // Black
        },
        accent: {
          playerOne: "#FFD700", // Gold
          playerTwo: "#B0C4DE", // LightSteelBlue
        },
        stroke: {
          playerOne: "#333333", // Dark Gray
          playerTwo: "#CCCCCC", // Light Gray
        },
        mirror: {
          playerOne: "#FF4500", // OrangeRed
          playerTwo: "#3CB371", // MediumSeaGreen
        },
        shield: {
          playerOne: "#FFC0CB", // Pink
          playerTwo: "#ADD8E6", // Light Blue
        },
      },
    },
  },
};
