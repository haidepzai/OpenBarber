// @ts-nocheck
import React, { Fragment, useContext, useState } from 'react';
import { Box, Button, Rating, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/auth-context';
import { reviewsAPI } from '../api/apiClient';
import PhotoUpload from './shared/PhotoUpload';

const Review = ({ shop, onReview }) => {
  const [value, setValue] = useState(1);
  const [comment, setComment] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const user = authCtx.user;
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleClick = async () => {
    const authorName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || '';
    const reviewRequest = { author: authorName, comment, rating: value, createdAt: new Date() };
    try {
      setErrorMessage('');
      const { data: createdReview } = await reviewsAPI.create(shop.id, reviewRequest);
      if (photoFile) {
        try {
          await reviewsAPI.uploadPhoto(createdReview.id, photoFile);
        } catch {
          setErrorMessage(t('PHOTO_UPLOAD_FAILED', 'Foto-Upload fehlgeschlagen'));
        }
      }
      setComment('');
      setValue(1);
      clearPhoto();
      onReview(true);
    } catch {
      setErrorMessage(t('REVIEW_ERROR', 'Bewertung fehlgeschlagen. Bitte erneut versuchen.'));
    }
  };

  if (!isLoggedIn) {
    return (
      <Fragment>
        <Typography variant="h4" textAlign="center">Reviews</Typography>
        <Box textAlign="center" sx={{ borderBottom: 1, borderColor: 'divider', pb: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
            {t('LOGIN_TO_REVIEW', 'Bitte einloggen um eine Bewertung zu hinterlassen.')}
          </Typography>
        </Box>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Typography variant="h4" textAlign="center">Reviews</Typography>
      <Box textAlign="center" sx={{ borderBottom: 1, borderColor: 'divider', pb: 3 }}>
        <Typography variant="h6" textAlign="center">
          {t('RATE', { shop: `${shop.name}` })}
        </Typography>
        <TextField
          label={t('YOUR_COMMENT')}
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 3, mt: 3, width: '50%' }}
          error={errorMessage.length > 0}
          helperText={errorMessage.length > 0 && errorMessage}
        />
        <Box sx={{ width: '50%', margin: '0 auto 24px' }}>
          <PhotoUpload
            previewSrc={photoPreview}
            onFileChange={(file, url) => { setPhotoFile(file); setPhotoPreview(url); }}
            onRemove={clearPhoto}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 4, pb: 3, mb: 5, width: '50%', margin: 'auto', alignItems: 'center' }}>
          <Rating value={value} onChange={(_, v) => setValue(v)} sx={{ mb: 3, mt: 3 }} />
          <Button variant="contained" color="primary" onClick={handleClick} disabled={comment.trim().length === 0}>
            {t('SEND_REVIEW').toUpperCase()}
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};

export default Review;
