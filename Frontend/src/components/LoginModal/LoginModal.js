import React, { Fragment, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Typography, Stack, TextField, Button, Checkbox } from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';
import OpenBarberLogo from '../../assets/logo_openbarber.svg';
import axios from 'axios';

const LoginModal = ({ onClose }) => {
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const portalElement = document.getElementById('overlays');

  useEffect(() => {
    const cb = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    document.addEventListener('keydown', cb);
    return () => document.removeEventListener('keydown', cb);
  }, [onClose]);

  const emailBlurHandler = (event) => {
    let regEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regEmail.test(event.target.value)) {
      setEmailIsValid(true);
    } else {
      setEmailIsValid(false);
    }
  };

  const passwordBlurHandler = (event) => {
    if (event.target.value.length !== 0) {
      setPasswordIsValid(true);
    } else {
      setPasswordIsValid(false);
    }
  };

  let formIsValid = false;

  if (emailIsValid && passwordIsValid) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    if (email.length === 0) {
      setEmailIsValid(false);
    }
    if (password.length === 0) {
      setPasswordIsValid(false);
    }
    if (formIsValid) {
    
      (async () => {

        const authRequest = {
          "email": email,
          "password": password
        };

        const customConfig = {
          headers: {
          'Content-Type': 'application/json'
          }
        };

        const response = await axios.post('http://localhost:8080/api/auth/authenticate', authRequest, customConfig);
        console.log(response.data); //TODO save token
      })();
      
        console.log('Done');
    }
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
                  error={!emailIsValid}
                  helperText={!emailIsValid && 'Please enter a correct email'}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={emailBlurHandler}
                />
                <TextField
                  label="Password"
                  required
                  error={!passwordIsValid}
                  helperText={!passwordIsValid && 'Please enter a password'}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={passwordBlurHandler}
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
