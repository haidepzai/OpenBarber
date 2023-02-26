import React, {useState} from 'react';
import '../css/components/Header.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import image from '../assets/logo_openbarber.svg';
import { Stack, Button, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const Header = ({ onLogin, onSignup }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
      <Grid container alignItems="center" sx={{ borderBottom: 1, borderColor: 'grey.300', p: "5px 10%" }}>
        <Grid item xs={isLoggedIn ? 4 : 6}>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
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
              <Button type="text" size="large" sx={{ "&:hover": { backgroundColor: "#fff" }}}>
                Manage Appointments
              </Button>
              <Button type="text" size="large" sx={{ "&:hover": { backgroundColor: "#fff" }}}>
                Edit Profile
              </Button>
            </Stack>
          </Grid>
        }
        <Grid item xs={isLoggedIn ? 4 : 6}>
          <Stack direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={1}>
            <Button variant="contained" color="secondary" onClick={onSignup}>
              Sign Up
            </Button>
            <Button variant="contained" color="secondary" onClick={onLogin}>
              Login
            </Button>
          </Stack>
        </Grid>
      </Grid>
    /*<Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        /!*sx={{ boxShadow: "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)"}}*!/
        sx={{ p: "0 10%" }}
    >

      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2} m ml="15px">
        <a href="/">
          <img src={image} width="50px" alt="logo"></img>
        </a>
        <a href="/">
          <Typography mt="10px !important" variant="h5" fontFamily="Roboto" fontWeight="500">
            OpenBarber
          </Typography>
        </a>
      </Stack>

      { isLoggedIn &&
        <Stack direction="row" spacing={10}>
          <Button type="text" size="large" sx={{ "&:hover": { backgroundColor: "#fff" }}}>
            Manage Appointments
          </Button>
          <Button type="text" size="large" sx={{ "&:hover": { backgroundColor: "#fff" }}}>
            Edit Profile
          </Button>
        </Stack>
      }

      <Stack direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={1}>
        <Button variant="contained" color="secondary" onClick={onSignup}>
          Sign Up
        </Button>
        <Button variant="contained" color="secondary" onClick={onLogin}>
          Login
        </Button>
      </Stack>

    </Stack>*/
  );
};

export default Header;
