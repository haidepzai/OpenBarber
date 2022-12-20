import React, { useEffect } from 'react';

import {
    Box,
    Typography,
    Stack,
    TextField,
    Button,
    Checkbox
} from '@mui/material'

import { ArrowBackRounded } from "@mui/icons-material"

import OpenBarberLogo from '../assets/logo_openbarber.svg';

const LoginModal = ({ onClose }) => {

    

    useEffect(() => {
        const cb = e => {
            if (e.key === 'Escape') {
                onClose?.();
            }
        }
        document.addEventListener('keydown', cb);
        return () => document.removeEventListener('keypress', cb);
    }, [onClose]);

  return (
    <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(0,0,0,0.2)',
        zIndex: 50,
        display: "grid",
        placeItems: "center",
    }}>
        <Box sx={{
            width: "600px",
            height: "800px",
            backgroundColor: "background.default",
            borderRadius: 5,
            boxShadow: 10,
            padding: 5,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",

        }}>
            <Stack direction="row" alignItems="center" gap={2} mb={8}>
                <Button variant='outlined' size='medium' onClick={onClose} startIcon={<ArrowBackRounded />}>
                    Back
                </Button>
                <div style={{flexGrow: 1}}></div>
                <Typography variant="h6" fontFamily="Roboto" fontWeight="500">
                    OpenBarber
                </Typography>
                <img src={OpenBarberLogo} style={{ width: "8%" }} />
            </Stack>
            <Typography variant="h5" fontFamily="Roboto" fontWeight="500">
                Login to manage your barber shops!
            </Typography>
            <Stack gap={2} mt={8} mb="auto">
                <TextField label="Company Email" required />
                <TextField label="Password" required />
                <Stack direction="row" alignItems="center">
                    <Checkbox />
                    <Typography>Keep me logged in</Typography>
                </Stack>
            </Stack>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                <Button variant='outlined' size='large' sx={{ flexGrow: 1 }}>
                    Sign Up Instead
                </Button>
                <Button variant='contained' size='large' sx={{ flexGrow: 4 }}>
                    Login
                </Button>
            </Box>
        </Box>
    </Box>
  );
};

export default LoginModal;
