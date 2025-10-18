type ValueByPlayer<ValueType> = {
  playerOne: ValueType;
  playerTwo: ValueType;
};

type ThemeConfig = {
  colors: {
    pieces: {
      primary: ValueByPlayer<string>;
      secondary: ValueByPlayer<string>;
      accent: ValueByPlayer<string>;
      stroke: ValueByPlayer<string>;
      mirror: ValueByPlayer<string>;
      shield: ValueByPlayer<string>;
    };
  };
};

type Themes = {
  [name: string]: ThemeConfig;
};

export const themes: Themes = {
  classic: {
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
