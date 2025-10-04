export const Footer = () => {
    return (
        <div className="container flex items-center justify-center gap-2 p-4 ">
            <a href="https://github.com/kishannareshpal/laserchess">
                <img 
                    alt="GitHub release version tag" 
                    src="https://img.shields.io/github/v/release/kishannareshpal/laserchess?include_prereleases&label=laserchess&style=flat-square"
                />
            </a> 

            <a className="text-black" href="https://kishanjadav.com">
                Kishan Jadav
            </a>
        </div>
    )
}