import React from 'react';
import ReactDOM from 'react-dom/client';
import TestChat from './TestChat';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <TestChat />
  </React.StrictMode>
);
