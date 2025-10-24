import { observable } from "@legendapp/state";
import type { ThemeName } from "../themes/theme";

type SettingsState = {
    theme: ThemeName
};

type SettingsActions = {
    setTheme: (theme: ThemeName) => void,
}

type Settings = SettingsState & SettingsActions;

const initialState: SettingsState = {
    theme: 'classic'
};

export const settings$ = observable<Settings>({
    ...initialState,

    setTheme: (theme) => {
        settings$.theme.set(theme);
    },
});
