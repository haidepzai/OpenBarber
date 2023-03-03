import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import { AuthContextProvider } from './context/auth-context';
import { SignupProvider } from './components/SignupModal/Signup.context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <SignupProvider>
            <App />
        </SignupProvider>
    </AuthContextProvider>
);
