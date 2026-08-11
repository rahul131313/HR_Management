import { toast } from './notifications';
export function handleSessionExpired() {
  toast.error('Your session has expired. Please log in again.');
  window.dispatchEvent(new CustomEvent('hr:session-expired'));
}
export function logClientError(error: unknown, context?: Record<string, unknown>) {
  if (import.meta.env.DEV) console.error('[CLIENT_ERROR]', error, context);
}
