import React, { Fragment, useContext, useReducer, useState } from 'react';
import { Stack, TextField, Typography, Button, CircularProgress } from '@mui/material';
import { SignupContext } from '../../../context/Signup.context';
import AuthContext from '../../../context/auth-context';

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const initialState = {
  enteredEmail: '',
  emailIsValid: true,
  emailAlreadyInUse: false,
  enteredPassword: '',
  passwordIsValid: true,
  passwordsMatch: true,
  enteredConfirmPassWord: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ENTERED_EMAIL':
      return {
        ...state,
        enteredEmail: action.payload,
      };
    case 'SET_EMAIL_IS_VALID':
      return {
        ...state,
        emailIsValid: action.payload,
      };
    case 'SET_EMAIL_ALREADY_IN_USE':
      return {
        ...state,
        emailAlreadyInUse: action.payload,
      };
    case 'SET_ENTERED_PASSWORD':
      return {
        ...state,
        enteredPassword: action.payload,
      };
    case 'SET_PASSWORD_IS_VALID':
      return {
        ...state,
        passwordIsValid: action.payload,
      };
    case 'SET_PASSWORDS_MATCH':
      return {
        ...state,
        passwordsMatch: action.payload,
      };
    case 'SET_ENTERED_CONFIRM_PASSWORD':
      return {
        ...state,
        enteredConfirmPassWord: action.payload,
      };
    default:
      return state;
  }
};

const SignUpStep = () => {
  const signUpContext = useContext(SignupContext);
  const authCtx = useContext(AuthContext);

  const [state, dispatch] = useReducer(reducer, initialState);

  const validEmail = () => emailRegex.test(state.enteredEmail);
  const validPassword = () => state.enteredPassword.length >= 8;
  const validConfirmPassword = () => state.enteredPassword === state.enteredConfirmPassWord;

  function onBlur(type) {
    switch (type) {
      case 'email':
        dispatch({ type: 'SET_EMAIL_IS_VALID', payload: validEmail() });
        break;
      case 'password':
        dispatch({ type: 'SET_PASSWORD_IS_VALID', payload: validPassword() });
        break;
      case 'confirmPassword':
        dispatch({ type: 'SET_PASSWORDS_MATCH', payload: validConfirmPassword() });
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
        email: state.enteredEmail,
        password: state.enteredPassword,
      };
      const customConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      try {
        authCtx.setIsLoading(true);
        await authCtx.onSignUp(registerRequest, customConfig);
        signUpContext.setData((d) => ({
          ...d,
          email: state.enteredEmail
        }));
        signUpContext.setCompletedSteps((v) => {
          const res = [...v];
          res[0] = true;
          return res;
        });
        signUpContext.setActiveStep(1);
      } catch (error) {
        dispatch({ type: 'SET_EMAIL_ALREADY_IN_USE', payload: true });
      }
      authCtx.setIsLoading(false);
    }
  }

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
              value={state.enteredEmail}
              error={!state.emailIsValid || state.emailAlreadyInUse}
              helperText={(!state.emailIsValid && 'Please enter a correct E-mail') || (state.emailAlreadyInUse && 'E-Mail already in use')}
              onChange={(e) => dispatch({ type: 'SET_ENTERED_EMAIL', payload: e.target.value })}
              onBlur={() => onBlur('email')}
            />
            <TextField
              label="Password"
              required
              type="password"
              value={state.enteredPassword}
              error={!state.passwordIsValid}
              helperText={!state.passwordIsValid && 'Password must be at least 8 characters long'}
              onChange={(e) => dispatch({ type: 'SET_ENTERED_PASSWORD', payload: e.target.value })}
              onBlur={() => onBlur('password')}
            />
            <TextField
              label="Confirm Password"
              required
              type="password"
              value={state.enteredConfirmPassWord}
              error={!state.passwordsMatch}
              helperText={!state.passwordsMatch && 'Passwords do not match'}
              onChange={(e) => dispatch({ type: 'SET_ENTERED_CONFIRM_PASSWORD', payload: e.target.value })}
              onBlur={() => onBlur('confirmPassword')}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between" marginTop="auto">
            <Button variant="outlined" onClick={() => signUpContext.close()} tabIndex={-1}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !(state.enteredEmail &&
                  state.enteredPassword &&
                  state.enteredConfirmPassWord) ||
                state.enteredPassword.length < 8 ||
                !state.passwordsMatch
              }
              variant="contained"
            >
              Continue
            </Button>
          </Stack>
        </Stack>
      }
    </Fragment>
  );
};

export default SignUpStep;
