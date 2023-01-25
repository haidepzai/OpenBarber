import './css/App.css';
import DetailPage from './pages/DetailPage/DetailPage';
import LandingPage from './pages/LandingPage/LandingPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { useState } from 'react';
import LoginModal from './components/LoginModal/LoginModal';
import { ThemeProvider } from '@mui/material/styles';
import { basicTheme } from './themes/basicTheme';
import FilterPage from './pages/FilterPage/FilterPage';
import SignupModal from './components/SignupModal/SignupModal';

function App() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);

  return (
    <ThemeProvider theme={basicTheme}>      
      <BrowserRouter>
        <Header onLogin={() => setLoginVisible(true)} onSignup={() => setSignupVisible(true)} />
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="shops/*" element={<DetailPage />} />
          <Route path="filter" element={<FilterPage />} />
          <Route path="privacy-policy" element={<Datenschutz />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      {loginVisible && <LoginModal onClose={() => setLoginVisible(false)} />}
      {signupVisible && <SignupModal onClose={() => setSignupVisible(false)} />}
    </ThemeProvider>
  );
}

export default App;
