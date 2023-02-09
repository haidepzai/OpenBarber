import { Grid } from '@mui/material';
import React, {useEffect} from 'react';
import MediaCard from '../../components/CardComponent/MediaCard';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Search from '../../layout/Search';
import { Box, Typography } from '@mui/material';
import MySwiper from '../../layout/MySwiper';
import barberShops from '../../mocks/shops';
import apiCall from "../../api/axiosConfig";
import axios from "axios";

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

  useEffect(() => {
    /*async function getShops() {
      const response = await apiCall.get('/enterprises');
      const barberShops = response.data;
      console.log(barberShops);
    }
    getShops();*/

    /*axios.get('http://localhost:8080/api/enterprises').then((response) => {
      console.log(response);
    })*/

    async function getShops() {
      /*const response = await axios.get('http://localhost:8080/api/enterprises');
      console.log(response.data);*/
      const response = await fetch("http://localhost:8080/api/enterprises", {
        method: 'GET',
      });
      console.log(response.json());

    }
    getShops();
    /*async function getShops2() {
      const response = await apiCall.get('/enterprises');
      const barberShops = response.data;
      console.log(barberShops);
    }
    getShops2();*/
  }, [])


  return (
    <>
      <Box sx={{ background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(93,71,58,1) 0%, rgba(160,142,131,1) 100%)', p: '50px 0' }}>
        <Typography variant="h2" sx={{ textAlign: 'center', color: 'primary.contrastText', pb: '50px', fontWeight: '400' }}>
          Get your desired haircut now!
        </Typography>
        <Search />
      </Box>
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
