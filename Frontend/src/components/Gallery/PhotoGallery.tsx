import React, { useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import beardImage from '../../assets/beard.jpg';
import ratingsImage from '../../assets/rating.jpg';
import mostImage from '../../assets/most.jpg';
import priceImage from '../../assets/price.jpg';
import locationImage from '../../assets/location.jpg';
import tipsImage from '../../assets/tips.jpg';
import { Typography, Box, useMediaQuery } from '@mui/material';
import PhotoSwiper from './PhotoSwiper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

const backupImages = [
  { name: 'Best Ratings', src: ratingsImage },
  { name: 'Cheapest Prices', src: priceImage },
  { name: 'Near you', src: locationImage },
  { name: 'With Beard Trimming', src: beardImage },
  { name: 'Most Ratings', src: mostImage },
  { name: 'Our personal tips', src: tipsImage },
];

const PhotoGallery = ({ pictures, reviewPhotos = [] }) => {
  const [openPhotoswiper, setOpenPhotoswiper] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const uploadedImages = [...(pictures ?? []), ...reviewPhotos.filter(Boolean)];
  const galleryImages = uploadedImages.length > 0 ? uploadedImages : backupImages;
  const getImageSrc = (image) => (typeof image === 'string' ? `data:image/jpeg;base64,${image}` : image.src);
  const getImageAlt = (image, index) => (typeof image === 'string' ? `shop-picture-${index}` : image.name);

  return (
    <Box>
      <Typography variant="h6" sx={{ pb: 1 }}>
        {galleryImages.length} {t('PHOTOS')}
      </Typography>
      <ImageList
        sx={{ width: '100%', height: { xs: 240, sm: 300, md: 344 }, borderRadius: '5px', boxShadow: 4, m: 0 }}
        cols={isMobile ? 2 : 4}
        rowHeight={isMobile ? 116 : isTablet ? 145 : 170}
        variant="quilted"
      >
        {galleryImages.map((image, index) => (
          <ImageListItem key={index} onClick={() => setOpenPhotoswiper(true)} sx={{ '&:hover': { cursor: 'pointer' } }}>
            <img src={getImageSrc(image)} alt={getImageAlt(image, index)} loading="lazy" style={{ objectFit: 'cover' }} />
          </ImageListItem>
        ))}
      </ImageList>
      {openPhotoswiper && <PhotoSwiper images={galleryImages} onClose={() => setOpenPhotoswiper(false)} />}
    </Box>
  );
};

export default PhotoGallery;
