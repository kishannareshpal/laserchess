import logo from "@/assets/logo.svg"
import { useTheme } from "@/lib/hooks/use-theme"

export const Header = () => {
    const theme = useTheme();

    return (
        <header className="flex justify-start py-2 pb-6 px-2" style={{ color: theme.colors.page.text }}>
            <nav className="flex flex-row flex-1 gap-3 items-center justify-between">
                <div className="flex flex-row gap-4 items-center justify-center">
                    <a href="#">
                        <img src={logo} alt="laser-chess.com logo" className="h-8" />
                    </a>
                    <p className="font-black text-lg">
                        Laser chess
                    </p>
                </div>

                {/* <div className="flex">
                    <select onChange={(event) => settings$.setTheme(event.target.value as ThemeName)}>
                        {themeNames.map((themeName) => (
                            <option key={themeName} value={themeName}>{themeName}</option>
                        ))}
                    </select>
                </div> */}
            </nav>
        </header>
    )
}