import React from 'react';
import '../../css/components/Header.css';
import image from './assets/logo_openbarber.svg';
import { Stack, Button, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { blueGrey } from '@mui/material/colors';

const Header = ({ onLogin }) => {
  return (
    <>
      <Grid container columns={16} sx={{ borderBottom: 1, borderColor: 'grey.300' }}>
        <Grid xs={8}>
          <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1} m ml="15px">
            <a href="/">
              <img src={image} width="50px"></img>
            </a>
            <a href="/">
              <Typography mt="10px !important" variant="h5" fontFamily="Roboto" fontWeight="500">
                OpenBarber
              </Typography>
            </a>
            <Divider orientation="vertical" flexItem />
          </Stack>
        </Grid>
        <Grid xs={8}>
          <Stack direction="row" justifyContent="flex-end" alignItems="flex-start" spacing={1} m mt="18px" mr="15px">
            <Button variant="contained" color="primary">
              Sign Up
            </Button>
            <Button variant="contained" color="primary" onClick={onLogin}>
              Login
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
