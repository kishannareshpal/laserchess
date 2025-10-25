/**
 * The application version at build time.
 */
export const buildVersion: string | undefined = import.meta.env.APP_VERSION;

/**
 * Short commit hash. The result of: `git rev-parse --short HEAD`
 * 
 * @example '8013673'
 */
export const buildCommitHash: string | undefined = import.meta.env.COMMIT_HASH;


/**
 * The date and time in ISO8601 format in UTC zone the current running build was made on.
 * 
 * @example '2025-09-14T08:57:16Z'
 * 
 * @see post-install – The bash script at `.eas/hooks/post-install` where this value is defined.
 */
export const buildDateTimeIso8601Utc: string | undefined = import.meta.env.BUILD_DATE_TIME_ISO8601_UTC;