// @ts-nocheck
import React from 'react';
import { Box, Stack, Typography, Button, Divider, IconButton, ImageList, ImageListItem, ImageListItemBar, useMediaQuery } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CollectionsIcon from '@mui/icons-material/Collections';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

const PictureUpload = ({ shop, handleLogoUpload, handlePicturesUpload, handleDeletePicture }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Typography variant="body1" sx={{ flex: '1', fontWeight: '500' }}>
            Logo
          </Typography>
          <Box sx={{ flex: '1', width: '100%' }}>
            <Button variant="contained" component="label" endIcon={<PhotoCamera />} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              Upload Logo
              <input type="file" hidden accept="image/png, image/jpeg" onChange={handleLogoUpload} />
            </Button>
          </Box>
        </Stack>
        {shop.logo && (
          <Box sx={{ mt: '24px' }}>
            <img alt="shop logo" src={`data:image/jpeg;base64,${shop.logo}`} width="100%" height="auto" style={{ maxHeight: '250px', objectFit: 'cover' }} />
          </Box>
        )}
      </Box>

      <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Typography variant="body1" sx={{ flex: '1', fontWeight: '500' }}>
            {t('PICTURES')}
          </Typography>
          <Box sx={{ flex: '1', width: '100%' }}>
            <Button variant="contained" component="label" endIcon={<CollectionsIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {t('UPLOAD_PICTURES')}
              <input type="file" hidden multiple accept="image/png, image/jpeg" onChange={handlePicturesUpload} />
            </Button>
          </Box>
        </Stack>
        {shop.pictures && shop.pictures.length > 0 && (
          <Box sx={{ mt: '24px' }}>
            <ImageList sx={{ width: '100%', height: { xs: 260, sm: 360, md: 444 }, borderRadius: '5px', boxShadow: 4 }} cols={isMobile ? 2 : 4} rowHeight={isMobile ? 120 : 220} variant="quilted">
              {shop.pictures.map((picture, index) => (
                <ImageListItem key={index}>
                  <img src={`data:image/jpeg;base64,${picture}`} alt={`picture-${index}`} loading="lazy" style={{ objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                  <ImageListItemBar
                    sx={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)' }}
                    position="top"
                    actionPosition="left"
                    actionIcon={
                      <IconButton sx={{ color: 'white' }} onClick={() => handleDeletePicture(index)}>
                        <DeleteOutlineIcon color="white" />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}
      </Box>
    </>
  );
};

export default PictureUpload;
