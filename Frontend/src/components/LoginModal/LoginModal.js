import React, { Fragment, useContext, useEffect, useReducer, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Typography, Stack, TextField, Button, Checkbox } from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';
import OpenBarberLogo from '../../assets/logo_openbarber.svg';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

// Reducer um mehrere States zu handeln
// Komplexere Update State Logik
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    let isValid = false;

    let regEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regEmail.test(action.val)) {
      isValid = true;
    } else {
      isValid = false;
    }
    return { value: action.val, isValid: isValid };
  }
  //state.value ist latest value
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: '', isValid: false };
};

const LoginModal = ({ onClose, onSuccess, gotoSignup }) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // Object Destructuring : pull out certain properties from object
  const { isValid: emailIsValid } = emailState; //Alias Assignment emailIsValid
  const { isValid: passwordIsValid } = passwordState; //Allias Assignment not Value Assignment!!

  const navigate = useNavigate();

  const portalElement = document.getElementById('overlays');

  useEffect(() => {
    const cb = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('keydown', cb);
    return () => {
      document.removeEventListener('keydown', cb);
    };
  }, [onClose]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);

    // clean up function (will run before the actual useEffect - except for the first time)
    return () => {
      clearTimeout(identifier); //Clear the last timer before a new one is set
    }; // Run before every new side effect execution and before component removed
  }, [emailIsValid, passwordIsValid]); //Effect wird getriggert. sobald ein Wert sich ändert

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value }); //trigger emailReducer function
    setFormIsValid(emailState.isValid && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });
    setFormIsValid(passwordState.isValid && emailState.isValid);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    (async () => {
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
        const res = await authCtx.onLogin(authRequest, customConfig);
        console.log(res);
        // Redirect to signup if not verified or has no enterprise
        const { verified, hasEnterprise } = res.data;
        if (!hasEnterprise || !verified) {
          gotoSignup({
            activeStep: hasEnterprise ? 2 : 1,
            completedSteps: [true, hasEnterprise, verified, false]
          });
        }

        onSuccess();
        onClose();
        navigate('/');
      } else if (!emailIsValid) {
        emailInputRef.current.focus();
      } else {
        passwordInputRef.current.focus();
      }
    })();

  };

  return (
    <Fragment>
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
                <Button variant="outlined" size="medium" onClick={onClose} startIcon={<ArrowBackRounded />}>
                  Back
                </Button>
                <div style={{ flexGrow: 1 }}></div>
                <Typography variant="h6" fontFamily="Roboto" fontWeight="500">
                  OpenBarber
                </Typography>
                <img src={OpenBarberLogo} alt="logo" style={{ width: '8%' }} />
              </Stack>
              <Typography variant="h5" fontFamily="Roboto" fontWeight="500">
                Login to manage your barber shops!
              </Typography>
              <Stack gap={2} mt={8} mb="auto">
                <TextField
                  label="Company Email"
                  required
                  ref={emailInputRef}
                  error={!emailIsValid}
                  helperText={!emailIsValid && 'Please enter a correct email'}
                  onChange={emailChangeHandler}
                  onBlur={validateEmailHandler}
                />
                <TextField
                  ref={passwordInputRef}
                  label="Password"
                  required
                  type="password"
                  error={!passwordIsValid}
                  helperText={!passwordIsValid && 'Please enter a password'}
                  onChange={passwordChangeHandler}
                  onBlur={validatePasswordHandler}
                />
                <Stack direction="row" alignItems="center">
                  <Checkbox />
                  <Typography>Keep me logged in</Typography>
                </Stack>
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                <Button variant="outlined" size="large" sx={{ flexGrow: 1 }}>
                  Sign Up Instead
                </Button>
                <Button type="submit" variant="contained" size="large" sx={{ flexGrow: 4 }} disabled={!formIsValid}>
                  Login
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
