import { classicTheme } from "./classic";
import type { ThemeConfig } from "./types";

type Themes = Record<ThemeName, ThemeConfig>

export const themeNames = [
  'classic'
] as const;

export type ThemeName = typeof themeNames[number]

export const themes: Themes = {
  'classic': classicTheme,
};
