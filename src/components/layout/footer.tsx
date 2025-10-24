export const Footer = () => {
    return (
        <div className="flex justify-start items-center text-sm gap-2">
            <a className="opacity-25 hover:opacity-100" href="https://github.com/kishannareshpal/laserchess">
                GitHub
            </a>
            <span className="opacity-25">{' • '}</span>
            <a className="opacity-25 hover:opacity-100" href="https://kishanjadav.com">
                Kishan Jadav
            </a>
        </div>
    )
}