import './css/App.css';
import DetailPage from './pages/DetailPage/DetailPage';
import LandingPage from './pages/LandingPage/LandingPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { useState } from 'react';
import LoginModal from './components/LoginModal/LoginModal';

function App() {
  const [loginVisible, setLoginVisible] = useState(false);

  return (
    <>
      <Header onLogin={() => setLoginVisible(true)} />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="shops/*" element={<DetailPage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
      {loginVisible && <LoginModal onClose={() => setLoginVisible(false)} />}
    </>
  );
}

export default App;
