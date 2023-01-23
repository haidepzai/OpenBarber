import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import CloseIcon from '@mui/icons-material/Close';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/lazy';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import '../../css/components/Swiper.css';

// import required modules
import { Lazy, Pagination, Navigation } from 'swiper';
import { Box, IconButton } from '@mui/material';
const PhotoSwiper = ({ images, onClose }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
      }}
    >
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        lazy={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Lazy, Pagination, Navigation]}
        className="mySwiper"
      >
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: '25px', right: '25px', zIndex: '1', color: 'white' }}>
          <CloseIcon sx={{ fontSize: '40px' }} />
        </IconButton>
        {images.map((image) => (
          <SwiperSlide key={image.name}>
            <img
              data-src={image.src}
              style={{ objectFit: 'cover', filter: 'brightness(0.7) contrast(1.2)', borderRadius: '10px' }}
              className="gallery-img swiper-lazy"
            />
            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default PhotoSwiper;
