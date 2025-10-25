import { buildDateTimeIso8601Utc } from "@/lib/build-info";
import { getAppVersionInfo } from "@/lib/version"

export const Footer = () => {
    const versionInfo = getAppVersionInfo();

    return (
        <div className="flex justify-start items-center text-xs gap-2 opacity-25">
            <a className="hover:underline" href="https://github.com/kishannareshpal/laserchess">
                GitHub
            </a>
            <span>•</span>
            <a className="hover:underline" href="https://kishanjadav.com">
                Kishan Jadav
            </a>

            {versionInfo ? (
                <>
                    <span>•</span>
                    <span title={buildDateTimeIso8601Utc}>{getAppVersionInfo()}</span>
                </>
            ) : null}
        </div>
    )
}