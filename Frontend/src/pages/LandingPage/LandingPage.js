import { Button, Divider, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MediaCard from '../../components/CardComponent/MediaCard';
import Search from '../../layout/Search';
import { Box, Typography } from '@mui/material';
import MySwiper from '../../layout/MySwiper';
import axios from 'axios';
import dayjs from 'dayjs';
import ReservationDialog from '../../components/Reservation/ReservationDialog';
import { useNavigate } from 'react-router-dom';
import { getEnterprises } from '../../context/EnterpriseActions';

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
  const navigate = useNavigate();

  const [dateAndTime, setDateAndTime] = useState(dayjs());
  const [shops, setShops] = useState([]);
  const [openReservationDialog, setOpenReservationDialog] = useState(false);

  const loadData = async () => {
    const shopsData = await getEnterprises();

    const promises = shopsData.map((shop) => {
      return new Promise((resolve, reject) => {
        axios
          .get('http://localhost:8080/api/reviews?enterpriseId=' + shop.id)
          .then((res) => {
            shop.reviews = res.data;
            console.log('found reviews', res.data);
            resolve(shop);
          })
          .catch((err) => {
            console.error('review request failed', err);
            reject(err);
          });
      });
    });
    console.log(promises);
    let shops = await Promise.all(promises);

    // let shops = await Promise.all([shopsData.map(shop => {
    //   return new Promise((resolve, reject) => {
    //     axios.get("http://localhost:8080/api/reviews?enterpriseId=" + shop.id).then(res => {
    //       shop.reviews = res.data;
    //       console.log("found reviews", res.data);
    //       resolve(shop);
    //     }).catch(err => {
    //       console.error("review request failed", err);
    //       reject(err);
    //     });
    //   });
    // })]);
    console.log('shops with review: ', shops);
    setShops(shops);
  };

  const rating = (shop) => {
    const sum = shop.reviews.map((review) => review.rating).reduce((a, b) => a + b, 0);
    const avg = sum / shop.reviews.length || 0;
    return avg;
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Box sx={{ background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(93,71,58,1) 0%, rgba(160,142,131,1) 100%)', p: '50px 0' }}>
        <Typography variant="h2" sx={{ textAlign: 'center', color: 'primary.contrastText', pb: '50px', fontWeight: '400' }}>
          Get your desired haircut now!
        </Typography>
        <Search dateAndTime={dateAndTime} setDateAndTime={setDateAndTime} />
      </Box>
      {/*paddingLeft: "10vh", paddingRight: "10vh" */}
      <Box sx={{ margin: '0 auto', maxWidth: '80%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: '36px', p: '0 15px' }}>
          <Typography variant="h5">Which barbers would you like to see?</Typography>
          <Button variant="text" onClick={() => navigate('/filter')} sx={{ fontSize: '15px' }}>
            Show All
          </Button>
        </Stack>
        <Divider orientation="horizontal" sx={{ m: '12px 0', borderColor: 'rgba(0, 0, 0, 0.24)' }} />
        <MySwiper />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: '36px', p: '0 15px' }}>
          <Typography variant="h5">Top Barbers near your location</Typography>
          <Button variant="text" onClick={() => navigate('/filter')} sx={{ fontSize: '15px' }}>
            Show All
          </Button>
        </Stack>
        <Divider orientation="horizontal" sx={{ m: '12px 0', borderColor: 'rgba(0, 0, 0, 0.24)' }} />
        <Stack direction="row" spacing={4} justifyContent="center" sx={{ pt: '20px' }}>
          {shops
            .slice(0, 5)
            .sort((a, b) => rating(b) - rating(a))
            .map((shop) => (
              <Box key={shop.id}>
                <MediaCard shop={shop} setOpenReservationDialog={setOpenReservationDialog} />
                <ReservationDialog open={openReservationDialog} handleClose={() => setOpenReservationDialog(false)} shop={shop} />
              </Box>
            ))}
        </Stack>
      </Box>
    </>
  );
};

export default LandingPage;
