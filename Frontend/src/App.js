import './css/App.css';
import DetailPage from './pages/DetailPage/DetailPage';
import LandingPage from './pages/LandingPage/LandingPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Footer from "./pages/components/Footer";
import Header from "./pages/components/Header";

function App() {
  return (
    <>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="shops/*" element={<DetailPage />} />
          </Routes>
        </BrowserRouter>
        <Footer />
    </>
  );
}

export default App;
