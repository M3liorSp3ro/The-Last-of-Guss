import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';


import { AuthProvider } from './app/providers/AuthProvider';
import { AppQueryProvider } from './app/providers/QueryProvider';
import './styles/global.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppQueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppQueryProvider>
  </React.StrictMode>,
);
