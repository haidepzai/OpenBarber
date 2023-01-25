import React, { useContext, useState } from 'react';

import { Stack, TextField, Typography, Button } from '@mui/material';
import { SignupContext } from '../Signup.context';

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

  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const validEmail = () => emailRegex.test(email);
  const validPassword = () => password.length !== 0;
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
  function onSubmit(e) {
    e.preventDefault();
    onBlur('email');
    onBlur('password');
    onBlur('confirmPassword');
    if (validEmail() && validPassword() && validConfirmPassword()) {
      console.log('Successful sign up!');
      setCompletedSteps((v) => {
        const res = [...v];
        res[0] = true;
        return res;
      });
      setActiveStep(1);
    }
  }

  const update = (type) => {
    return (e) => {
      setData((d) => ({ ...d, [type]: e.target.value }));
      setCompletedSteps((v) => {
        const res = [...v];
        res[0] = false;
        res[1] = false;
        return res;
      });
    };
  };

  return (
    <Stack component="form" onSubmit={onSubmit} height="100%">
      <Stack gap={2} mt={8} mb="auto" width="max(500px, 50%)">
        <Typography variant="h4" fontWeight="bold">
          Sign Up
        </Typography>
        <Typography variant="body1" color="textSecondary" marginBottom={4}>
          Please enter your company email and create a password to sign up.
        </Typography>
        <TextField
          label="Company Email"
          required
          value={email}
          error={!emailIsValid}
          helperText={!emailIsValid && 'Please enter a correct email'}
          onChange={update('email')}
          onBlur={() => onBlur('email')}
        />
        <TextField
          label="Password"
          required
          type="password"
          value={password}
          error={!passwordIsValid}
          helperText={!passwordIsValid && 'Please enter a password'}
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
        <Button type="submit" disabled={!(email && password && confirmPassword)} variant="contained">
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};

export default SignUpStep;
