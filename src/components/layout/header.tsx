import logo from "@/assets/logo-light.png"

export const Header = () => {
    return (
        <header className="flex justify-start border-b-1 py-2 pb-6 px-2 border-white/25">
            <nav className="flex flex-row rounded-lg gap-4 items-center justify-center">
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