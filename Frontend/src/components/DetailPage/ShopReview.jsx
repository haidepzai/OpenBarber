import React from 'react';
import { Rating, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const AVATAR_URL = 'https://www.shareicon.net/data/2016/09/15/829473_man_512x512.png';

const ShopReview = ({ review }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: 4, borderBottom: 1, borderColor: 'divider', pb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Box
          boxShadow={2}
          sx={{ width: '5rem', height: '5rem', borderRadius: '50%', backgroundImage: `url(${AVATAR_URL})`, backgroundSize: 'cover' }}
        ></Box>
        <Rating readOnly precision={0.5} value={review.rating} sx={{ color: 'primary.main' }} size="small" />
        <Typography variant="span" color="grey.400">
          {dayjs(review.createdAt).format('DD/MM/YYYY hh:mm A')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5">
          <Typography variant="span" sx={{ fontWeight: 600 }}>
            {review.author}
          </Typography>
          &nbsp;{t('WROTE')}.toLowerCase():
        </Typography>

        <Typography variant="body1">{review.comment}</Typography>
        {/*<Typography variant="span" color="grey.400" mt="auto">
          {review.name} has added 0 photos to the gallery.
        </Typography>*/}
      </Box>
    </Box>
  );
};

export default ShopReview;
