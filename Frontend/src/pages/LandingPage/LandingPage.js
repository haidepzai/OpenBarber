import { Grid } from '@mui/material';
import React from 'react';
import MediaCard from '../../components/CardComponent/MediaCard';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Search from '../../layout/Search';
import { Box, Typography } from '@mui/material';
import MySwiper from '../../layout/MySwiper';
import barberShops from '../../mocks/shops';

/*const theme = createTheme({
  palette: {
    type: 'light',
    /!* colors from https://m2.material.io/inline-tools/color/ *!/
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
});*/

const LandingPage = () => {
  return (
    <>
      <Box sx={{ background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(93,71,58,1) 0%, rgba(160,142,131,1) 100%)', p: '50px 0' }}>
        <Typography variant="h2" sx={{ textAlign: 'center', color: 'primary.contrastText', pb: '50px', fontWeight: '400' }}>
          Get your desired haircut now!
        </Typography>
        <Search />
      </Box>
      <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: '0px 50px' }}>
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
              <Grid item key={shop.name}>
                <MediaCard                  
                  title={shop.name}
                  image={shop.image}
                  rating={shop.rating}
                  description={shop.description}
                  reviews={shop.reviews}
                  shop={shop}
                  link={`shops/${shop.id}`}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LandingPage;
