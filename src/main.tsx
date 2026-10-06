import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/styles/global.css';
import '@/shared/i18n/i18n';
import App from '@/app/App';

// Register mock services when VITE_USE_MOCKS=true
if (import.meta.env.VITE_USE_MOCKS === 'true') {
  // Dynamic import keeps mocks out of the production bundle
  import('@/mocks').then(({ registerMocks }) => registerMocks());
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found. Make sure index.html has <div id="root">');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
