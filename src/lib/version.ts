import { buildCommitHash, buildVersion } from "./build-info";

export const getAppVersionInfo = (): string | undefined => {
    if (import.meta.env.DEV) {
        return 'local';
    }

    if (!buildVersion || !buildCommitHash) {
        return undefined;
    }

    return `${buildVersion}-${buildCommitHash}`
}