import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './ui.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import { OfflineBanner, ToastRegion } from './notifications';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastRegion>
        <OfflineBanner />
        <App />
      </ToastRegion>
    </ErrorBoundary>
  </StrictMode>,
);
