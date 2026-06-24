import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './css/index.css';
import App from './App';
import { AuthContextProvider } from './context/auth-context';
import { SignupProvider } from './context/Signup.context';
import './i18n';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
    <AuthContextProvider>
      <SignupProvider>
        <App />
      </SignupProvider>
    </AuthContextProvider>
  </GoogleOAuthProvider>
);
