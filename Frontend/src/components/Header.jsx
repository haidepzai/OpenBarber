import React from 'react';
import '../css/components/Header.css';
import image from '../assets/logo_openbarber.svg';
import { Stack, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Link, useNavigate } from 'react-router-dom';
import { SignupContext } from '../context/Signup.context';
import { useContext } from 'react';
import AuthContext from '../context/auth-context';

const Header = () => {
  const signUpCtx = useContext(SignupContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

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
                Manage Appointments
              </Button>
              <Button type="text" size="large" sx={{ '&:hover': { backgroundColor: '#fff' } }} onClick={() => navigate('/edit')}>
                Edit Profile
              </Button>
            </Stack>
          </Grid>
        )}

        <Grid xs={authCtx.isLoggedIn ? 4 : 6}>
          <Stack direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={1}>
            {!authCtx.isLoggedIn && (
              <Button variant="contained" color="secondary" onClick={() => signUpCtx.setSignupVisible(true)}>
                Sign Up
              </Button>
            )}
            {!authCtx.isLoggedIn && (
              <Button variant="contained" color="secondary" onClick={() => signUpCtx.setLoginVisible(true)}>
                Login
              </Button>
            )}
            {authCtx.isLoggedIn && (
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
