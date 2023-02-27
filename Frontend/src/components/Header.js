import React from 'react';
import '../css/components/Header.css';
import image from '../assets/logo_openbarber.svg';
import { Stack, Button, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {useNavigate} from "react-router-dom";

const Header = ({ onLogin, onSignup, isLoggedIn, onLogout, deleteJWT }) => {

    function handleLogout() {
      onLogout()
      deleteJWT()
    }

    const navigate = useNavigate();

    return (
    <>
      <Grid container columns={12} alignItems="center" sx={{ borderBottom: 1, borderColor: 'grey.300', p: "5px 10%" }}>
        <Grid xs={isLoggedIn ? 4 : 6}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <a href="/">
              <img src={image} width="50px" alt="logo"></img>
            </a>
            <a href="/">
              <Typography variant="h5" fontFamily="Roboto" fontWeight="500">
                OpenBarber
              </Typography>
            </a>
          </Stack>
        </Grid>

      {isLoggedIn &&
          <Grid item xs={4}>
              <Stack direction="row" alignItems="center" spacing={8}>
                  <Button type="text" size="large" sx={{ "&:hover": { backgroundColor: "#fff" }}} onClick={() => navigate('/scheduler')}>
                      Manage Appointments
                  </Button>
                  <Button type="text" size="large" sx={{ "&:hover": { backgroundColor: "#fff" }}} onClick={() => navigate('/edit')}>
                      Edit Profile
                  </Button>
              </Stack>
          </Grid>
      }

        <Grid xs={isLoggedIn ? 4 : 6}>
          <Stack direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={1}>
            {!(isLoggedIn) && <Button variant="contained" color="secondary" onClick={onSignup}>
              Sign Up
            </Button>}
            {!(isLoggedIn) && <Button variant="contained" color="secondary" onClick={onLogin}>
              Login
            </Button>}
            {isLoggedIn && <Button variant="contained" color="secondary" onClick={handleLogout}>
              Logout
            </Button>}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
