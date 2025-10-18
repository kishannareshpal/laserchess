import logo from "@/assets/logo-light.png"

export const Header = () => {
    return (
        <header className="flex items-center justify-center">
            <nav className="flex flex-row border-2 border-black/25 px-4 py-3 rounded-lg gap-4 items-center justify-center bg-black/25">
                <a href="#">
                    <img src={logo} alt="laser-chess.com logo" className="h-8" />
                </a>
                <p className="font-black text-lg">
                    Laser chess
                </p>
            </nav>
        </header>
    )
}