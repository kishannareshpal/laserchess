import logo from "@/assets/logo.png"

export const Header = () => {
    return (
        <header className="border-b-1 border-b-gray-300">
            <nav className="container py-2">
                <a href="#">
                    <img src={logo} alt="laser-chess.com logo" className="h-16" />
                </a>
            </nav>
        </header>
    )
}