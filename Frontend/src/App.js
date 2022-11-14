import './css/App.css';
import DetailPage from './pages/DetailPage/DetailPage';
import LandingPage from './pages/LandingPage/LandingPage';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="shops/*" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
