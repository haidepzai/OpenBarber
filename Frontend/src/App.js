import './css/App.css';
import DetailPage from './pages/DetailPage/DetailPage';
import LandingPage from './pages/LandingPage/LandingPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import LoginModal from './components/LoginModal/LoginModal';
import { ThemeProvider } from '@mui/material/styles';
import { basicTheme } from './themes/basicTheme';
import FilterPage from './pages/FilterPage/FilterPage';
import SignupModal from './components/SignupModal/SignupModal';
import Datenschutz from './pages/Datenschutz';
import SchedulerPage from "./pages/Scheduler";
import EditEnterprisePage from "./pages/EditEnterprise";

function App() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  function deleteJWTTokenFromStorage(){
    let token = localStorage.getItem('tokenJWT');
    if(token) {
      localStorage.removeItem('tokenJWT')
    } 
  }

  function checkForJWTToken() {
    let token = localStorage.getItem('tokenJWT');
    if(token) {
      setIsLoggedIn(true)
      return true
    } 
    setIsLoggedIn(false)
    return false
  }


  useEffect(() => {
    checkForJWTToken()
  }, [])

  const loadData = async () => {
    const response = await fetch("http://localhost:8080/api/enterprises")
    const responseData = await response.json();
    console.log(responseData)
  }

  useEffect(() => {
    loadData()
  }, [])


  return (
    <ThemeProvider theme={basicTheme}>      
      <BrowserRouter>
        <Header onLogin={() => setLoginVisible(true)} 
                onSignup={() => setSignupVisible(true)} 
                isLoggedIn= {isLoggedIn} 
                onLogout={() => setIsLoggedIn(false)}
                deleteJWT={() => deleteJWTTokenFromStorage()} />
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="shops/*" element={<DetailPage />} />
          <Route path="filter" element={<FilterPage />} />
          <Route path="privacy-policy" element={<Datenschutz />} />
          <Route path="scheduler" element={<SchedulerPage />} />
          <Route path="edit" element={<EditEnterprisePage />} />
        </Routes>
        <Footer />
        {loginVisible && <LoginModal onClose={() => setLoginVisible(false)} onSuccess={() => setIsLoggedIn(true)} />}
        {signupVisible && <SignupModal onClose={() => setSignupVisible(false)} />}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
