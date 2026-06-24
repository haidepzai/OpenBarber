import './css/App.css';
import DetailPage from './pages/DetailPage';
import LandingPage from './pages/LandingPage';
import ErrorPage from './pages/ErrorPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import { useContext } from 'react';
import LoginModal from './components/LoginModal/LoginModal';
import { ThemeProvider } from '@mui/material/styles';
import { basicTheme } from './themes/basicTheme';
import FilterPage from './pages/FilterPage';
import SignupModal from './components/SignupModal/SignupModal';
import Datenschutz from './pages/Datenschutz';
import SchedulerPage from './pages/SchedulerPage';
import EditShopPage from './pages/EditShopPage';
import { SignupContext } from './context/Signup.context';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import CancelAppointment from './pages/CancelAppointment';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import CustomerEditProfilePage from './pages/CustomerEditProfilePage';
import AuthContext from './context/auth-context';

// Only accessible for logged-in shop operators
const OperatorRoute = ({ children }) => {
  const authCtx = useContext(AuthContext);
  if (!authCtx.isLoggedIn) return <Navigate to="/" replace />;
  if (authCtx.role === 'VERIFIED') return <Navigate to="/my-appointments" replace />;
  return children;
};

// Only accessible for logged-in customers
const CustomerRoute = ({ children }) => {
  const authCtx = useContext(AuthContext);
  if (!authCtx.isLoggedIn) return <Navigate to="/" replace />;
  if (authCtx.role === 'OPERATOR') return <Navigate to="/edit" replace />;
  return children;
};

function App() {
  const signUpCtx = useContext(SignupContext);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={basicTheme}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="shops/:routeId" element={<DetailPage />} />
            <Route path="filter" element={<FilterPage />} />
            <Route path="privacy-policy" element={<Datenschutz />} />
            <Route path="scheduler" element={<OperatorRoute><SchedulerPage /></OperatorRoute>} />
            <Route path="edit" element={<OperatorRoute><EditShopPage /></OperatorRoute>} />
            <Route path="my-appointments" element={<CustomerRoute><CustomerProfilePage /></CustomerRoute>} />
            <Route path="my-profile" element={<CustomerRoute><CustomerEditProfilePage /></CustomerRoute>} />
            <Route path="appointment/:routeId" element={<AppointmentConfirmation/>}/>
            <Route path="cancel-appointment/:routeId" element={<CancelAppointment/>}/>
            <Route path="reset-password" element={<ResetPasswordPage/>}/>
          </Routes>
          <Footer />
          {signUpCtx.loginVisible && (
            <LoginModal
              gotoSignup={(state) => {
                signUpCtx.setSignupState(state);
                signUpCtx.setActiveStep(state.activeStep);
                signUpCtx.setCompletedSteps(state.completedSteps);
                signUpCtx.setLoginVisible(false);
                signUpCtx.setSignupVisible(true);
              }}
            />
          )}
          {signUpCtx.signupVisible && <SignupModal />}
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
