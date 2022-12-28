import { Grid } from '@mui/material';
import React from 'react';
import MediaCard from '../../components/CardComponent/MediaCard';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Search from './components/Search';
import { Box, Typography } from '@mui/material';
import MySwiper from './components/MySwiper';

const theme = createTheme({
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

const LandingPage = () => {
  const barberShops = [
    {
      id: 1,
      name: 'Barber Shop',
      rating: 4,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: 'https://cdn.mdr.de/ratgeber/friseur-haare-schneiden-106_v-variantBig16x9_w-576_zc-915c23fa.jpg?version=27611',
    },
    {
      id: 2,
      name: 'Barber Shop 2',
      rating: 4.5,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: 'https://cdn.mdr.de/ratgeber/friseur-haare-schneiden-106_v-variantBig16x9_w-576_zc-915c23fa.jpg?version=27611',
    },
    {
      id: 3,
      name: 'Barber Shop 3',
      rating: 5,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: 'https://cdn.mdr.de/ratgeber/friseur-haare-schneiden-106_v-variantBig16x9_w-576_zc-915c23fa.jpg?version=27611',
    },
  ];

  return (
    <>
      <ThemeProvider theme={theme}>
        <Search />
        <Box sx={{ maxWidth: '1500px', margin: '0 auto', padding: '0px 50px' }}>
          <Typography variant="h5" sx={{ paddingBottom: '10px', borderBottom: '1px solid rgba(0,0, 0, 0.3)', m: '20px 0' }}>
            Which barbers would you like to see?
          </Typography>
          <MySwiper />
          <Typography variant="h5" sx={{ paddingBottom: '10px', borderBottom: '1px solid rgba(0,0, 0, 0.3)', m: '20px 0' }}>
            Top Barbers near your location
          </Typography>
          <Grid sx={{ flexGrow: 1 }} container>
            <Grid container justifyContent="center" spacing={5}>
              {barberShops.map((shop) => (
                <Grid item>
                  <MediaCard
                    key={shop.name}
                    title={shop.name}
                    image={shop.image}
                    rating={shop.rating}
                    description={shop.description}
                    link={`shops/${shop.id}`}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default LandingPage;
