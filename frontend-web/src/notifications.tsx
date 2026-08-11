import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';

type Notice = {
  id: number;
  kind: 'success' | 'error' | 'info';
  message: string;
};
let publish: ((notice: Omit<Notice, 'id'>) => void) | undefined;
export const toast = {
  success: (message: string) => publish?.({ kind: 'success', message }),
  error: (message: string) => publish?.({ kind: 'error', message }),
  info: (message: string) => publish?.({ kind: 'info', message }),
};
export function ToastRegion({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Notice[]>([]);
  useEffect(() => {
    publish = (notice) => {
      const item = { ...notice, id: Date.now() };
      setItems((current) => [...current, item]);
      window.setTimeout(
        () => setItems((current) => current.filter((existing) => existing.id !== item.id)),
        4500,
      );
    };
    return () => {
      publish = undefined;
    };
  }, []);
  return (
    <>
      {children}
      <div className="toast-region" aria-live="assertive">
        {items.map((item) => (
          <div className={`toast ${item.kind}`} key={item.id}>
            {item.kind === 'success' ? (
              <CheckCircle2 size={17} />
            ) : item.kind === 'error' ? (
              <AlertCircle size={17} />
            ) : (
              <Info size={17} />
            )}
            <span>{item.message}</span>
            <button
              aria-label="Dismiss notification"
              onClick={() =>
                setItems((current) => current.filter((existing) => existing.id !== item.id))
              }
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
export function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);
  return online ? null : (
    <div className="offline-banner" role="status">
      No internet connection. Check your connection and retry.
    </div>
  );
}
