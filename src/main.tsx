import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/styles/global.css';
import '@/shared/i18n/i18n';
import App from '@/app/App';

import { registerMocks } from '@/mocks';

// Register mock services by default unless explicitly disabled (e.g. VITE_USE_MOCKS=false)
if (import.meta.env.VITE_USE_MOCKS !== 'false') {
  registerMocks();
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
