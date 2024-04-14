import React from 'react';
import '../css/components/Header.css';
import image from '../assets/logo_openbarber.svg';
import { Stack, Button, Typography, IconButton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Link, useNavigate } from 'react-router-dom';
import { SignupContext } from '../context/Signup.context';
import { useContext, useState } from 'react';
import AuthContext from '../context/auth-context';
import { useTranslation } from 'react-i18next';

import germanyFlag from '../assets/germany-flag.png';
import britishFlag from '../assets/british-flag.png';

const Header = () => {
  const signUpCtx = useContext(SignupContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
  }

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

        {authCtx.isLoggedIn && (
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" spacing={8}>
              <Button type="text" size="large" sx={{ '&:hover': { backgroundColor: '#fff' } }} onClick={() => navigate('/scheduler')}>
                {t('Manage_Appointment')}
              </Button>
              <Button type="text" size="large" sx={{ '&:hover': { backgroundColor: '#fff' } }} onClick={() => navigate('/edit')}>
                {t('Edit_Profile')}
              </Button>
            </Stack>
          </Grid>
        )}

        <Grid xs={authCtx.isLoggedIn ? 4 : 6}>
          <Stack direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={1}>
            {!authCtx.isLoggedIn && (
              <Button variant="contained" color="secondary" onClick={() => signUpCtx.setSignupVisible(true)}>
                {t('Sign_Up')}
              </Button>
            )}
            {!authCtx.isLoggedIn && (
              <Button variant="contained" color="secondary" onClick={() => signUpCtx.setLoginVisible(true)}>
                {t('Login')}
              </Button>
            )}
            {authCtx.isLoggedIn && (
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                {t('Logout')}
              </Button>
            )}
            <IconButton onClick={() => changeLanguage('de')}>
              <img src={germanyFlag} alt="DE" style={{ width: '24px', height: '24px' }} />
            </IconButton>
            <IconButton onClick={() => changeLanguage('en')}>
              <img src={britishFlag} alt="EN" style={{ width: '24px', height: '24px' }} />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
