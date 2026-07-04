// @ts-nocheck
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../css/components/Swiper.scss';
// import required modules
import { Navigation, Pagination } from 'swiper';

import beardImage from '../../assets/beard.jpg';
import ratingsImage from '../../assets/rating.jpg';
import mostImage from '../../assets/most.jpg';
import priceImage from '../../assets/price.jpg';
import locationImage from '../../assets/location.jpg';
import tipsImage from '../../assets/tips.jpg';
import luxuryImage from '../../assets/luxury.jpg';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ShopHighlightsSlider() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const criteria = [
    { name: t('BEST_RATINGS'), src: ratingsImage, value: { sortValue: 'Best Rating' } },
    { name: t('OUR_PERSONAL_TIPS'), src: tipsImage, value: { sortValue: 'Suggested' } },
    { name: t('CHEAPEST_PRICE'), src: priceImage, value: { priceCategory: [1] } },
    { name: t('MOST_RATINGS'), src: mostImage, value: { sortValue: 'Most Ratings' } },
    { name: t('LUXURIOUS_SERVICES'), src: luxuryImage, value: { priceCategory: [3] } },
    { name: t('NEAR_YOU'), src: locationImage },
    { name: t('BEARD_TRIMMING'), src: beardImage },
  ];

  /*  const handleClick = () => {
      navigate('/filter', { state: { location: 'Test' } });
    };*/

  return (
    <div style={{ position: 'relative', zIndex: 0 }} className="swiper-landing-page ">
      <Swiper
        slidesPerView={5}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 12 },
          480: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 20 },
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Pagination, Navigation]}
      >
        {criteria.map((currElement) => (
          <SwiperSlide
            key={currElement.name}
            onClick={() => navigate('/filter', { state: { [Object.keys(currElement.value)[0]]: Object.values(currElement.value)[0] } })}
          >
            <Box
              sx={{
                padding: '0',
                position: 'relative',
                height: '300px',
                width: '300px',
                borderRadius: '10px',
                boxShadow: 'rgba(0, 0, 0, 0.6) 0px 2px 8px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  cursor: 'pointer',
                  transform: 'scale(1.04)',
                  boxShadow: 'rgba(0, 0, 0, 0.7) 0px 8px 24px',
                  '& .swiper-img': {
                    filter: 'brightness(0.4) contrast(1.3)',
                    transform: 'scale(1.08)',
                  },
                  '& h4': {
                    textShadow: '3px 3px 6px rgba(93,71,58,0.9)',
                    letterSpacing: '2px',
                  },
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <img
                  className="swiper-img"
                  src={currElement.src}
                  alt="category"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.55) contrast(1.2)',
                    transition: 'transform 0.3s ease, filter 0.3s ease',
                  }}
                />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  textAlign: 'center',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '85%',
                  margin: '0',
                  color: 'white.main',
                  fontSize: 'clamp(0.95rem, 1.5vw, 1.5rem)',
                  lineHeight: 1.3,
                  transition: 'letter-spacing 0.3s ease, text-shadow 0.3s ease',
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

export default ShopHighlightsSlider;
