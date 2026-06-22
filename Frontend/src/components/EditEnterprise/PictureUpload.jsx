import React from 'react';
import { Box, Stack, Typography, Button, Divider, IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CollectionsIcon from '@mui/icons-material/Collections';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTranslation } from 'react-i18next';

const PictureUpload = ({ enterprise, handleLogoUpload, handlePicturesUpload, handleDeletePicture }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ padding: '0 48px' }}>
        <Stack direction="row">
          <Typography variant="body1" sx={{ flex: '1', fontWeight: '500' }}>
            Logo
          </Typography>
          <Box sx={{ flex: '1' }}>
            <Button variant="contained" component="label" endIcon={<PhotoCamera />}>
              Upload Logo
              <input type="file" hidden accept="image/png, image/jpeg" onChange={handleLogoUpload} />
            </Button>
          </Box>
        </Stack>
        {enterprise.logo && (
          <Box sx={{ mt: '24px' }}>
            <img
              alt="enterprise logo"
              src={`data:image/jpeg;base64,${enterprise.logo}`}
              width="100%"
              height="auto"
              style={{ maxHeight: '250px', objectFit: 'cover' }}
            />
          </Box>
        )}
      </Box>

      <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

      <Box sx={{ padding: '0 48px' }}>
        <Stack direction="row">
          <Typography variant="body1" sx={{ flex: '1', fontWeight: '500' }}>
            {t('PICTURES')}
          </Typography>
          <Box sx={{ flex: '1' }}>
            <Button variant="contained" component="label" endIcon={<CollectionsIcon />}>
              {t('UPLOAD_PICTURES')}
              <input type="file" hidden multiple accept="image/png, image/jpeg" onChange={handlePicturesUpload} />
            </Button>
          </Box>
        </Stack>
        {enterprise.pictures && enterprise.pictures.length > 0 && (
          <Box sx={{ mt: '24px' }}>
            <ImageList sx={{ width: '100%', height: '444px', borderRadius: '5px', boxShadow: 4 }} cols={4} rowHeight={220} variant="quilted">
              {enterprise.pictures.map((picture, index) => (
                <ImageListItem key={index}>
                  <img
                    src={`data:image/jpeg;base64,${picture}`}
                    alt={`picture-${index}`}
                    loading="lazy"
                    style={{ objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  />
                  <ImageListItemBar
                    sx={{
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                    }}
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
