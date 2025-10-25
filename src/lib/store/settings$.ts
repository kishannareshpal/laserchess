import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage"
import type { ThemeName } from "../themes/theme";
import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync"

type SettingsState = {
    theme: ThemeName,
    tabletopMode: boolean
};

type SettingsActions = {
    setTheme: (theme: ThemeName) => void,
    toggleTabletopMode: (enabled: boolean) => void,
}

type Settings = SettingsState & SettingsActions;

const initialState: SettingsState = {
    theme: 'classic',
    tabletopMode: false
};

export const settings$ = observable<Settings>({
    ...initialState,

    setTheme: (theme) => {
        settings$.theme.set(theme);
    },

    toggleTabletopMode: (enabled) => {
        settings$.tabletopMode.set(enabled);
    }
})

// Persist the observable to the named key of the global persist plugin
syncObservable(settings$, {
    persist: {
        name: 'lc-settings',
        plugin: ObservablePersistLocalStorage
    }
})
