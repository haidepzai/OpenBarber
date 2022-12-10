import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Search from "./components/Search";
import {Box, Typography} from "@mui/material";
import MySwiper from "./components/MySwiper";
import Header from "../../pages/components/Header"
import Footer from "../components/Footer";

const theme = createTheme({
  palette: {
    type: 'light',
    /* colors from https://m2.material.io/inline-tools/color/ */
    primary: {
      main: '#6D5344',
      contrastText: '#fff'
    },
    secondary: {
      main: '#445e6d',
    },
    analogous: {
      main: '#6d4449'
    },
    white: {
      main: '#fff'
    }
  }
})

const LandingPage = () => {
  return (
    <>
    <ThemeProvider theme={theme}>
      <Search />
      <Box sx={{ maxWidth: "1500px", margin: "0 auto", padding: "0px 50px" }}>
        <Typography variant="h5" sx={{ paddingBottom: "10px", borderBottom: "1px solid rgba(0,0, 0, 0.3)", m: "20px 0" }}>
          Which barbers would you like to see?
        </Typography>
        <MySwiper />
        <Typography variant="h5" sx={{ paddingBottom: "10px", borderBottom: "1px solid rgba(0,0, 0, 0.3)", m: "20px 0" }}>
          Top Barbers near your location
        </Typography>
      </Box>
    </ThemeProvider>
    </>
  );
};

export default LandingPage;
