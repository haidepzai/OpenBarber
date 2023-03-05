import React, { Fragment, useContext, useState } from 'react';
import { Stack, TextField, Typography, Button, CircularProgress } from '@mui/material';
import { SignupContext } from '../../../context/Signup.context';
import AuthContext from '../../../context/auth-context';

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const SignUpStep = () => {
  const {
    close,
    setActiveStep,
    setCompletedSteps,
    data: { email, password, confirmPassword },
    setData,
  } = useContext(SignupContext);

  const authCtx = useContext(AuthContext);

  const [emailIsValid, setEmailIsValid] = useState(true);
  const [emailAlreadyInUse, setEmailAlreadyInUse] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const validEmail = () => emailRegex.test(email);
  const validPassword = () => password.length >= 8;
  const validConfirmPassword = () => password === confirmPassword;

  function onBlur(type) {
    switch (type) {
      case 'email':
        setEmailIsValid(validEmail());
        break;
      case 'password':
        setPasswordIsValid(validPassword());
        break;
      case 'confirmPassword':
        setPasswordsMatch(validConfirmPassword());
        break;
      default:
        break;
    }
  }

  async function onSubmit(e) {
    e.preventDefault();

    onBlur('email');
    onBlur('password');
    onBlur('confirmPassword');

    if (validEmail() && validPassword() && validConfirmPassword()) {
      const registerRequest = {
        email: email,
        password: password,
      };
      const customConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      try {
        authCtx.setIsLoading(true);
        await authCtx.onSignUp(registerRequest, customConfig);
      } catch (error) {
        setEmailAlreadyInUse(true);
      }
      setCompletedSteps((v) => {
        const res = [...v];
        res[0] = true;
        return res;
      });
      setActiveStep(1);
      authCtx.setIsLoading(false);
    }
  }

  const update = (type) => {
    return (e) => {
      setData((d) => ({ ...d, [type]: e.target.value }));
      setCompletedSteps((v) => {
        const res = [...v];
        res[0] = false;
        res[1] = false;
        res[2] = false;
        return res;
      });
    };
  };

  return (
    <Fragment>
      {authCtx.isLoading &&
        <Stack alignItems="center" justifyContent="center" flexGrow="1">
          <CircularProgress />
        </Stack>
      }
      {!authCtx.isLoading &&
        <Stack component="form" onSubmit={onSubmit} height="100%">
          <Stack gap={2} mt={8} mb="auto" width="max(500px, 50%)">
            <Typography variant="h4" fontWeight="bold">
              Sign Up
            </Typography>
            <Typography variant="body1" color="textSecondary" marginBottom={4}>
              Please enter your company E-mail and create a password to sign up.
            </Typography>
            <TextField
              label="Company Email"
              required
              value={email}
              error={!emailIsValid || emailAlreadyInUse}
              helperText={(!emailIsValid && 'Please enter a correct E-mail') || (emailAlreadyInUse && 'E-Mail already in use')}
              onChange={update('email')}
              onBlur={() => onBlur('email')}
            />
            <TextField
              label="Password"
              required
              type="password"
              value={password}
              error={!passwordIsValid}
              helperText={!passwordIsValid && 'Password must be at least 8 characters long'}
              onChange={update('password')}
              onBlur={() => onBlur('password')}
            />
            <TextField
              label="Confirm Password"
              required
              type="password"
              value={confirmPassword}
              error={!passwordsMatch}
              helperText={!passwordsMatch && 'Passwords do not match'}
              onChange={update('confirmPassword')}
              onBlur={() => onBlur('confirmPassword')}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between" marginTop="auto">
            <Button variant="outlined" onClick={close} tabIndex={-1}>
              Cancel
            </Button>
            <Button type="submit" disabled={!(email && password && confirmPassword) || password.length < 8 || !passwordsMatch} variant="contained">
              Continue
            </Button>
          </Stack>
        </Stack>
      }
    </Fragment>
  );
};

export default SignUpStep;
