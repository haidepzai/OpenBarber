import { createTheme } from '@mui/material/styles';

export const basicTheme = createTheme({
  palette: {
    type: 'light',
    /* colors from https://m2.material.io/inline-tools/color/ */
    primary: {
      main: '#6D5344',
      contrastText: '#fff',
    },
    secondary: {
      main: '#445e6d',
    },
    analogous: {
      main: '#6d4449',
    },
    white: {
      main: '#fff',
    },
  },
});
