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
            <span className="opacity-25">{' • '} {globalThis.__APP_VERSION__} at {globalThis.__COMMIT_HASH__}</span>
        </div>
    )
}