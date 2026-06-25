// @ts-nocheck
import React, { Fragment, useContext, useReducer, useState } from 'react';
import { Stack, TextField, Typography, Button, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { SignupContext } from '../../../context/Signup.context';
import AuthContext from '../../../context/auth-context';
import PasswordRequirements from '../../PasswordRequirements';
import { useTranslation } from 'react-i18next';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState = {
  enteredEmail: '',
  emailIsValid: true,
  emailAlreadyInUse: false,
  enteredPassword: '',
  passwordIsValid: true,
  passwordsMatch: true,
  enteredConfirmPassWord: '',
  enteredFirstName: '',
  enteredLastName: '',
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
    case 'SET_ENTERED_FIRST_NAME':
      return {
        ...state,
        enteredFirstName: action.payload,
      };
    case 'SET_ENTERED_LAST_NAME':
      return {
        ...state,
        enteredLastName: action.payload,
      };
    default:
      return state;
  }
};

const SignUpStep = () => {
  const signUpContext = useContext(SignupContext);
  const authCtx = useContext(AuthContext);

  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { t } = useTranslation();
  const accountType = signUpContext.data?.accountType;

  const validEmail = () => emailRegex.test(state.enteredEmail);
  const validPassword = () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,128}$/.test(state.enteredPassword);
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
        firstName: state.enteredFirstName,
        lastName: state.enteredLastName,
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
          email: state.enteredEmail,
          firstName: state.enteredFirstName,
          lastName: state.enteredLastName,
        }));
        signUpContext.setCompletedSteps((v) => {
          const res = [...v];
          res[1] = true;
          return res;
        });
        // Customer → go to email verification (step 2); Shop → go to shop setup (step 2)
        signUpContext.setActiveStep(2);
      } catch (error) {
        dispatch({ type: 'SET_EMAIL_ALREADY_IN_USE', payload: true });
      }
      authCtx.setIsLoading(false);
    }
  }

  return (
    <Fragment>
      {authCtx.isLoading && (
        <Stack alignItems="center" justifyContent="center" flexGrow="1">
          <CircularProgress />
        </Stack>
      )}
      {!authCtx.isLoading && (
        <Stack component="form" onSubmit={onSubmit} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Stack gap={2} mt={4} sx={{ overflowY: 'auto', flexGrow: 1, pr: 1, pb: 2 }}>
            <Typography variant="h4" fontWeight="bold">
              {t('SIGN_UP')}
            </Typography>
            <Typography variant="body1" color="textSecondary" marginBottom={4}>
              {t('SIGN_UP_TITLE')}
            </Typography>
            <Stack direction="row" gap={2}>
              <TextField
                label={t('FIRST_NAME')}
                required
                value={state.enteredFirstName}
                onChange={(e) => dispatch({ type: 'SET_ENTERED_FIRST_NAME', payload: e.target.value })}
                sx={{ flex: 1 }}
              />
              <TextField
                label={t('LAST_NAME')}
                required
                value={state.enteredLastName}
                onChange={(e) => dispatch({ type: 'SET_ENTERED_LAST_NAME', payload: e.target.value })}
                sx={{ flex: 1 }}
              />
            </Stack>
            <TextField
              label={accountType === 'shop' ? t('COMPANY_MAIL') : t('EMAIL_ADDRESS')}
              required
              value={state.enteredEmail}
              error={!state.emailIsValid || state.emailAlreadyInUse}
              helperText={(!state.emailIsValid && 'Please enter a correct E-mail') || (state.emailAlreadyInUse && 'E-Mail already in use')}
              onChange={(e) => dispatch({ type: 'SET_ENTERED_EMAIL', payload: e.target.value })}
              onBlur={() => onBlur('email')}
            />
            <TextField
              label={t('PASSWORD')}
              required
              type={showPassword ? 'text' : 'password'}
              value={state.enteredPassword}
              error={!state.passwordIsValid}
              helperText={!state.passwordIsValid && 'Password must contain upper, lower, number, special char and be 8+ chars'}
              onChange={(e) => dispatch({ type: 'SET_ENTERED_PASSWORD', payload: e.target.value })}
              onBlur={() => onBlur('password')}
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
            <PasswordRequirements password={state.enteredPassword} />
            <TextField
              label={t('CONFIRM_PASSWORD')}
              required
              type={showConfirmPassword ? 'text' : 'password'}
              value={state.enteredConfirmPassWord}
              error={!state.passwordsMatch}
              helperText={!state.passwordsMatch && 'Passwords do not match'}
              onChange={(e) => dispatch({ type: 'SET_ENTERED_CONFIRM_PASSWORD', payload: e.target.value })}
              onBlur={() => onBlur('confirmPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((v) => !v)} edge="end">
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ pt: 2, mt: 'auto', flexShrink: 0, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" onClick={() => signUpContext.setActiveStep(0)} tabIndex={-1}>
              {t('BACK')}
            </Button>
            <Button
              type="submit"
              disabled={
                !(state.enteredFirstName && state.enteredLastName && state.enteredEmail && state.enteredPassword && state.enteredConfirmPassWord) ||
                !validEmail() ||
                !validPassword() ||
                !state.passwordsMatch
              }
              variant="contained"
            >
              {t('CONTINUE')}
            </Button>
          </Stack>
        </Stack>
      )}
    </Fragment>
  );
};

export default SignUpStep;
