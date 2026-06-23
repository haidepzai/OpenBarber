import React from 'react';
import '../css/components/Header.css';
import image from '../assets/logo_openbarber.svg';
import { Stack, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Link, useNavigate } from 'react-router-dom';
import { SignupContext } from '../context/Signup.context';
import { useContext } from 'react';
import AuthContext from '../context/auth-context';
import { useTranslation } from 'react-i18next';
import LanguagePicker from './LanguagePicker/LanguagePicker';

const Header = () => {
  const signUpCtx = useContext(SignupContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const { t } = useTranslation();

  function handleLogout() {
    authCtx.onLogout();
    authCtx.deleteJWTTokenFromStorage();
    navigate('/');
  }

  return (
    <>
      <Grid container columns={12} alignItems="center" sx={{ borderBottom: 1, borderColor: 'grey.300', p: '5px 10%' }}>
        <Grid xs={authCtx.isLoggedIn ? 4 : 6}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link to="/">
              <img src={image} width="50px" alt="logo"></img>
            </Link>
            <Link to="/">
              <Typography variant="h5" fontFamily="Roboto" fontWeight="500">
                OpenBarber
              </Typography>
            </Link>
          </Stack>
        </Grid>

        {authCtx.isLoggedIn && authCtx.role === 'OPERATOR' && (
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={8}>
              <Button type="text" size="large" sx={{ '&:hover': { backgroundColor: '#fff' } }} onClick={() => navigate('/scheduler')}>
                {t('MANAGE_APPOINTMENT')}
              </Button>
              <Button type="text" size="large" sx={{ '&:hover': { backgroundColor: '#fff' } }} onClick={() => navigate('/edit')}>
                {t('EDIT_PROFILE')}
              </Button>
            </Stack>
          </Grid>
        )}

        {authCtx.isLoggedIn && authCtx.role === 'VERIFIED' && (
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={8}>
              <Button type="text" size="large" sx={{ '&:hover': { backgroundColor: '#fff' } }} onClick={() => navigate('/my-profile')}>
                {t('MY_APPOINTMENTS')}
              </Button>
            </Stack>
          </Grid>
        )}

        <Grid xs={authCtx.isLoggedIn ? 4 : 6}>
          <Stack direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={1}>
            {!authCtx.isLoggedIn && (
              <Button variant="contained" color="secondary" onClick={() => signUpCtx.setSignupVisible(true)}>
                {t('SIGN_UP')}
              </Button>
            )}
            {!authCtx.isLoggedIn && (
              <Button variant="contained" color="secondary" onClick={() => signUpCtx.setLoginVisible(true)}>
                {t('LOGIN')}
              </Button>
            )}
            {authCtx.isLoggedIn && (
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                {t('LOGOUT')}
              </Button>
            )}
            <LanguagePicker />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
