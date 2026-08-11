export type ApiError = {
  success: false;
  code: string;
  message: string;
  fields?: Record<string, string>;
  timestamp?: string;
};
export function isApiError(value: unknown): value is ApiError {
  return typeof value === 'object' && value !== null && 'code' in value && 'message' in value;
}
export function userMessage(error: unknown): string {
  if (!navigator.onLine) return 'No internet connection. Check your connection and retry.';
  if (error instanceof Error) return error.message;
  return 'Something went wrong on our end. Our team has been notified.';
}
