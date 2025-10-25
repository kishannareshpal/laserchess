/**
 * The application version at build time.
 */
export const buildVersion: string | undefined = import.meta.env.VITE_BUILD_APP_VERSION;

/**
 * Short commit hash. The result of: `git rev-parse --short HEAD`
 * 
 * @example '8013673'
 */
export const buildCommitHash: string | undefined = import.meta.env.VITE_BUILD_COMMIT_HASH;


/**
 * The date and time in ISO8601 format in UTC zone the current running build was made on.
 * 
 * @example '2025-09-14T08:57:16Z'
 */
export const buildDateTimeIso8601Utc: string | undefined = import.meta.env.VITE_BUILD_DATE_TIME_ISO8601_UTC;