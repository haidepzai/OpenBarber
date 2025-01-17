import { Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { Fragment, useContext, useReducer, useState } from 'react';
import AuthContext from '../../context/auth-context';
import { updateUser } from '../../actions/UserActions';
import { useTranslation } from 'react-i18next';

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

const EditPersonalInfo = ({ onLoadingUser, onOpenSnackBar }) => {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);

  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: true,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: true,
  });

  // Object Destructuring : pull out certain properties from object
  const { isValid: emailIsValid } = emailState; //Alias Assignment emailIsValid
  const { isValid: passwordIsValid } = passwordState; //Alias Assignment not Value Assignment!!

  const saveUser = async () => {
    try {
      await updateUser(authCtx.userId, authCtx.user);
      onOpenSnackBar(t('USER_CHANGES_SAVED'));
    } catch (error) {
      onOpenSnackBar(t('COULD_NOT_SAVE_USER'));
    }
  };

  const resetUser = async () => {
    await onLoadingUser();
    onOpenSnackBar(t('USER_DATA_RESET'));
  };

  const handleUserChange = (event) => {
    if (event.target.name === 'email') {
      emailChangeHandler(event);
    } else if (event.target.name === 'password') {
      passwordChangeHandler(event);
    }
    const name = event.target.name;
    const value = event.target.value;
    authCtx.setUser({
      ...authCtx.user,
      [name]: value,
    });
  };

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

  return (
    <Fragment>
      <Typography variant="h1" sx={{ fontSize: '22px', fontWeight: '500', color: 'rgba(0, 0, 0, 1)', m: '40px 0 10px 24px' }}>
        {t('PERSONAL_INFO')}
      </Typography>
      <Typography variant="h2" sx={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.45)', m: '0 0 20px 24px' }}>
        {t('PERSONAL_INFO_TITLE')}
      </Typography>
      <Paper elevation={2}>
        <Stack
          direction="column"
          spacing={3}
          divider={<Divider orientation="horizontal" flexItem />}
          sx={{
            padding: '24px 0',
            '& > *': {
              padding: '0 48px',
            },
            '& > * > *': {
              flex: '1',
            },
            '& > * > p': {
              fontWeight: '500',
            },
            '& > * > * > p': {
              fontWeight: '500',
            },
          }}
        >
          <Stack direction="row">
            <Typography variant="body1">{t('NAME')}</Typography>
            <TextField
              InputLabelProps={{ shrink: false }}
              name="name"
              placeholder={t('NAME')}
              value={authCtx.user.name === null ? '' : authCtx.user.name}
              onChange={handleUserChange}
              fullWidth
            />
          </Stack>

          <Stack direction="row">
            <Typography variant="body1">{t('EMAIL_ADDRESS')}</Typography>
            <TextField
              type="email"
              InputLabelProps={{ shrink: false }}
              name="email"
              placeholder={t('EMAIL_ADDRESS')}
              value={authCtx.user.email === null ? '' : authCtx.user.email}
              error={!emailIsValid}
              helperText={!emailIsValid && 'Please enter a correct email'}
              onChange={handleUserChange}
              onBlur={validateEmailHandler}
              fullWidth
            />
          </Stack>

          <Stack direction="row">
            <Typography variant="body1">{t('PASSWORD')}</Typography>
            <TextField
              type="password"
              InputLabelProps={{ shrink: false }}
              name="password"
              placeholder={t('PASSWORD')}
              error={!passwordIsValid}
              helperText={!passwordIsValid && t('PLEASE_ENTER_PASSWORD')}
              onChange={handleUserChange}
              onBlur={validatePasswordHandler}
              fullWidth
            />
          </Stack>
        </Stack>

        <Divider orientation="horizontal" sx={{ mb: '24px' }} />

        <Stack direction="row" aligncontent="center" justifyContent="space-between" sx={{ p: '0 24px 24px 24px' }} spacing={4}>
          <Button variant="outlined" onClick={resetUser}>
            {t('RESET')}
          </Button>
          <Button variant="contained" onClick={saveUser} disabled={!formIsValid}>
            {t('SAVE_CHANGES')}
          </Button>
        </Stack>
      </Paper>
    </Fragment>
  );
};

export default EditPersonalInfo;
