import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './css/index.scss';
import App from './App';
import { AuthContextProvider } from './context/auth-context';
import { SignupProvider } from './context/Signup.context';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,      // 2 min — data stays fresh
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SignupProvider>
          <App />
        </SignupProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
