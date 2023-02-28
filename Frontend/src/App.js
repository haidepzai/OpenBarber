import './css/App.css';
import DetailPage from './pages/DetailPage/DetailPage';
import LandingPage from './pages/LandingPage/LandingPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { useContext, useEffect, useState } from 'react';
import LoginModal from './components/LoginModal/LoginModal';
import { ThemeProvider } from '@mui/material/styles';
import { basicTheme } from './themes/basicTheme';
import FilterPage from './pages/FilterPage/FilterPage';
import SignupModal from './components/SignupModal/SignupModal';
import Datenschutz from './pages/Datenschutz';
import SchedulerPage from './pages/Scheduler';
import EditEnterprisePage from './pages/EditEnterprise';
import AuthContext from './context/auth-context';

function App() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const ctx = useContext(AuthContext);

  return (
    <ThemeProvider theme={basicTheme}>
      <BrowserRouter>
        <Header
          onLogin={() => setLoginVisible(true)}
          onSignup={() => setSignupVisible(true)}
          isLoggedIn={ctx.isLoggedIn}
          onLogout={() => ctx.onLogout}
          deleteJWT={() => ctx.deleteJWTTokenFromStorage()}
        />
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="shops/:routeId" element={<DetailPage />} />
          <Route path="filter" element={<FilterPage />} />
          <Route path="privacy-policy" element={<Datenschutz />} />
          <Route path="scheduler" element={<SchedulerPage />} />
          <Route path="edit" element={<EditEnterprisePage />} />
        </Routes>
        <Footer />
        {loginVisible && <LoginModal onClose={() => setLoginVisible(false)} onSuccess={() => ctx.setIsLoggedIn(true)} />}
        {signupVisible && <SignupModal onClose={() => setSignupVisible(false)} />}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
