import { buildCommitHash, buildDateTimeIso8601Utc, buildVersion } from "./build-info";

export const appVersionInfo = `${buildVersion}-${buildCommitHash} at ${buildDateTimeIso8601Utc})`