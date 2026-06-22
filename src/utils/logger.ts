/**
 * Structured client-side logging.
 *
 * Routes errors through a unified interface for consistency across the app.
 * In development, logs to console for debugging. In production, can be
 * extended to send to observability services (Sentry, DataDog, etc.).
 */

interface LogContext {
  [key: string]: unknown
}

/**
 * Log an error with optional context.
 * Dev mode: console.error with formatted details.
 * Prod mode: ready for observability integration (context preserved).
 */
export function logError(
  message: string,
  error?: Error | unknown,
  context?: LogContext
): void {
  const isDev = import.meta.env.DEV

  const logEntry = {
    level: 'error',
    message,
    timestamp: new Date().toISOString(),
    error:
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error,
    context: context || {},
  }

  if (isDev) {
    console.error(`[${logEntry.timestamp}] ${message}`, { error, context })
  }
}

/**
 * Log a warning with optional context.
 */
export function logWarn(
  message: string,
  context?: LogContext
): void {
  const isDev = import.meta.env.DEV
  if (isDev) {
    console.warn(`[WARN] ${message}`, context || {})
  }
}

/**
 * Log informational message.
 */
export function logInfo(
  message: string,
  context?: LogContext
): void {
  const isDev = import.meta.env.DEV
  if (isDev) {
    console.log(`[INFO] ${message}`, context || {})
  }
}
