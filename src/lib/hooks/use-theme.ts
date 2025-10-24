import { use$ } from "@legendapp/state/react"
import { settings$ } from "../store/settings$"
import { themes } from "../themes/theme";

export const useTheme = () => {
    const selectedTheme = use$(settings$.theme);

    return themes[selectedTheme];
}