import React from 'react';

import { Box } from '@mui/material';

const DetailPageBG = ({ img }) => {
  return (
    <Box
      sx={{
        backgroundSize: 'cover',
        backgroundImage: `url(${img ? URL.createObjectURL(img) : "https://www.americanexpress.com/de-de/amexcited/media/cache/default/cms/2021/12/Barbershops-Stuttgart-Herrenhaus-2.jpg"})`,
        backgroundPosition: 'center',

        width: '100%',
        height: '40vh',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default DetailPageBG;
