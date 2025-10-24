import { useValue } from "@legendapp/state/react"
import { settings$ } from "../store/settings$"
import { themes } from "../themes/theme";

export const useTheme = () => {
    const selectedTheme = useValue(settings$.theme);

    return themes[selectedTheme];
}