import { isAxiosError } from "axios";

/** The most useful message from an API or network error, or the fallback. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || error.message || fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** True when the server answered (the API interceptor has already shown a toast). */
export function hasResponse(error: unknown): boolean {
  return isAxiosError(error) && !!error.response;
}
