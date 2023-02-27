import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../css/components/Swiper.css';
// import required modules
import { Navigation, Pagination } from 'swiper';

import beardImage from '../assets/beard.jpg';
import ratingsImage from '../assets/rating.jpg';
import mostImage from '../assets/most.jpg';
import priceImage from '../assets/price.jpg';
import locationImage from '../assets/location.jpg';
import tipsImage from '../assets/tips.jpg';
import luxuryImage from "../assets/luxury.jpg"

import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MySwiper(props) {
  const navigate = useNavigate();

  const criteria = [
    {name: 'Best Ratings', src: ratingsImage, value: { sortValue : 'Best Rating' } },
    {name: 'Our personal tips', src: tipsImage, value: { sortValue : 'Suggested' } },
    {name: 'Cheapest Prices', src: priceImage, value: { priceCategory: [1] } },
    {name: 'Most Ratings', src: mostImage, value: { sortValue : 'Most Ratings' } },
    {name: 'Luxurious Services', src: luxuryImage, value: { priceCategory: [3] } },
    {name: 'Near you', src: locationImage },
    {name: 'With Beard Trimming', src: beardImage },
  ];

/*  const handleClick = () => {
    navigate('/filter', { state: { location: 'Test' } });
  };*/

  return (
    <div style={{ position: 'relative' }} className="swiper-landing-page ">
      <Swiper
        slidesPerView={5}
        spaceBetween={20}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
      >
        {criteria.map((currElement) => (
          <SwiperSlide key={currElement.name} onClick={() => navigate('/filter', { state: { [Object.keys(currElement.value)[0]]: Object.values(currElement.value)[0] }})}>
            <Box
              sx={{
                padding: '0',
                position: 'relative',
                height: '300px',
                width: '300px',
                borderRadius: '10px',
                boxShadow: 'rgba(0, 0, 0, 0.6) 0px 2px 8px',
                transition: '0.15s ease-in-out',
                '& img': {
                  objectFit: 'cover',
                  filter: 'brightness(0.55) contrast(1.2)',
                  borderRadius: '10px',
                  transition: '0.15s ease-in-out',
                },
                '&:hover': {
                  cursor: 'pointer',
                  '& img': {
                    filter: 'brightness(0.55) contrast(1.2)',
                  },
                  '& h4': {
                    textShadow: '3px 3px 1px #6D5344',
                  },
                },
              }}
            >
              <img src={currElement.src} alt="category" />
              <Typography
                variant="h4"
                sx={{
                  textAlign: 'center',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  margin: '0',
                  color: 'white.main',
                  transition: '0.15s ease-in-out'
                }}
              >
                {currElement.name}
              </Typography>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default MySwiper;
