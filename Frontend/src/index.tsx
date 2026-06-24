import React from 'react';
import ReactDOM from 'react-dom/client';
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
  <AuthContextProvider>
    <SignupProvider>
      <App />
    </SignupProvider>
  </AuthContextProvider>
);
