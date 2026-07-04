// @ts-nocheck
import React, { Fragment, useContext, useEffect, useReducer, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Typography, Stack, TextField, Button, Checkbox, IconButton, InputAdornment } from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';
import OpenBarberLogo from '../../assets/logo_openbarber.svg';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import { SignupContext } from '../../context/Signup.context';
import { useTranslation } from 'react-i18next';
import ForgotPasswordModal from './ForgotPasswordModal';

import { emailReducer, passwordReducer } from '../../reducers/formReducers';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginModal = ({ gotoSignup }) => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [loginIsFound, setLoginIsFound] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: true,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: true,
  });

  const authCtx = useContext(AuthContext);
  const signUpCtx = useContext(SignupContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Object Destructuring : pull out certain properties from object
  const { isValid: emailIsValid } = emailState; //Alias Assignment emailIsValid
  const { isValid: passwordIsValid } = passwordState; //Allias Assignment not Value Assignment!!

  const navigate = useNavigate();
  const { t } = useTranslation();

  const portalElement = document.getElementById('overlays');

  useEffect(() => {
    const cb = (e) => {
      if (e.key === 'Escape') {
        signUpCtx.setLoginVisible(false);
      }
    };
    document.addEventListener('keydown', cb);
    return () => {
      document.removeEventListener('keydown', cb);
    };
  }, [signUpCtx]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid && (emailState.length !== 0 || passwordState.length !== 0));
    }, 500);

    // clean up function (will run before the actual useEffect - except for the first time)
    return () => {
      clearTimeout(identifier); //Clear the last timer before a new one is set
    }; // Run before every new side effect execution and before component removed
  }, [emailIsValid, passwordIsValid, emailState.length, passwordState.length]); //Effect wird getriggert. sobald ein Wert sich ändert

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value }); //trigger emailReducer function
    setFormIsValid(emailState.isValid && passwordState.isValid && (emailState.length !== 0 || passwordState.length !== 0));
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
    setFormIsValid(passwordState.isValid && emailState.isValid && (emailState.length !== 0 || passwordState.length !== 0));
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const handleSignUp = () => {
    signUpCtx.setLoginVisible(false);
    signUpCtx.setSignupVisible(true);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setLoginIsFound(false);
      return;
    }

    try {
      const res = await authCtx.onGoogleLogin(credentialResponse.credential);
      signUpCtx.setLoginVisible(false);
      const { hasShop } = res.data;
      if (hasShop) {
        navigate('/edit');
      } else {
        navigate('/my-appointments');
      }
    } catch {
      setLoginIsFound(false);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (formIsValid) {
      const authRequest = {
        email: emailState.value,
        password: passwordState.value,
      };
      const customConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      try {
        const res = await authCtx.onLogin(authRequest, customConfig, rememberMe);
        // Redirect to signup if not verified or has no shop
        const { verified, hasShop } = res.data;
        if (!verified) {
          gotoSignup({
            activeStep: hasShop ? 3 : 2,
            completedSteps: [true, true, hasShop, false, false],
          });
          signUpCtx.setData((prevData) => ({ ...prevData, email: emailState.value, accountType: hasShop ? 'shop' : 'customer' }));
        }

        if (verified) {
          authCtx.setIsLoggedIn(true);
          signUpCtx.setLoginVisible(false);
          authCtx.setEmail(emailState.value);
          if (hasShop) {
            navigate('/edit');
          } else {
            navigate('/my-appointments');
          }
        }
      } catch (error) {
        setLoginIsFound(false);
      }
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Fragment>
      {showForgotPassword && <ForgotPasswordModal onBack={() => setShowForgotPassword(false)} />}
      {ReactDOM.createPortal(
        <form onSubmit={submitHandler}>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              width: '100vw',
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(0,0,0,0.2)',
              zIndex: 50,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '600px',
                height: '800px',
                backgroundColor: 'background.default',
                borderRadius: 5,
                boxShadow: 10,
                padding: 5,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack direction="row" alignItems="center" gap={2} mb={8}>
                <Button variant="outlined" size="medium" onClick={() => signUpCtx.setLoginVisible(false)} startIcon={<ArrowBackRounded />}>
                  {t('BACK')}
                </Button>
                <div style={{ flexGrow: 1 }}></div>
                <Typography variant="h6" fontFamily="Roboto" fontWeight="500">
                  OpenBarber
                </Typography>
                <img src={OpenBarberLogo} alt="logo" style={{ width: '8%' }} />
              </Stack>
              <Typography variant="h5" fontFamily="Roboto" fontWeight="500">
                {t('LOGIN_TITLE')}
              </Typography>
              <Stack gap={2} mt={8} mb="auto">
                <TextField
                  label={t('EMAIL_ADDRESS')}
                  required
                  ref={emailInputRef}
                  error={!emailIsValid || !loginIsFound}
                  helperText={(!emailIsValid && t('PLEASE_ENTER_MAIL')) || (!loginIsFound && t('NO_MAIL_OR_PASSWORD'))}
                  onChange={emailChangeHandler}
                  onBlur={validateEmailHandler}
                />
                <TextField
                  ref={passwordInputRef}
                  label={t('PASSWORD')}
                  required
                  type={showPassword ? 'text' : 'password'}
                  error={!passwordIsValid}
                  helperText={!passwordIsValid && t('PLEASE_ENTER_PASSWORD')}
                  onChange={passwordChangeHandler}
                  onBlur={validatePasswordHandler}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Stack direction="row" alignItems="center">
                  <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <Typography>{t('KEEP_LOGGED_IN')}</Typography>
                </Stack>
                <Button
                  variant="text"
                  size="small"
                  sx={{ alignSelf: 'flex-start', textTransform: 'none', p: 0, color: 'text.secondary' }}
                  onClick={() => setShowForgotPassword(true)}
                >
                  {t('FORGOT_PASSWORD')}
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                  <Typography variant="caption" color="text.secondary">
                    {t('OR')}
                  </Typography>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => setLoginIsFound(false)}
                    text="signin_with"
                    shape="rectangular"
                    size="large"
                  />
                </Box>
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                <Button variant="outlined" size="large" sx={{ flexGrow: 1 }} onClick={handleSignUp}>
                  {t('SIGNUP_INSTEAD')}
                </Button>
                <Button type="submit" variant="contained" size="large" sx={{ flexGrow: 4 }} disabled={!formIsValid}>
                  {t('LOGIN')}
                </Button>
              </Box>
            </Box>
          </Box>
        </form>,
        portalElement
      )}
    </Fragment>
  );
};

export default LoginModal;
