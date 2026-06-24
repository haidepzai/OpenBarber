// @ts-nocheck
import React, { Fragment, useContext, useState } from 'react';

import { Box, Button, Rating, TextField, Typography } from '@mui/material';
import { createReviewAuth } from '../actions/ReviewActions';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/auth-context';
import { reviewsAPI } from '../api/apiClient';

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

  const clearSelectedPhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleClick = async () => {
    const authorName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || '';
    const reviewRequest = {
      author: authorName,
      comment: comment,
      rating: value,
      createdAt: new Date(),
    };

    try {
      setErrorMessage('');
      const createdReview = await createReviewAuth(reviewRequest, shop.id);
      if (photoFile) {
        try {
          await reviewsAPI.uploadPhoto(createdReview.id, photoFile);
        } catch (error) {
          setErrorMessage(t('PHOTO_UPLOAD_FAILED', 'Foto-Upload fehlgeschlagen'));
        }
      }
      setComment('');
      setValue(1);
      clearSelectedPhoto();
      onReview(true);
    } catch (error) {
      setErrorMessage(t('REVIEW_ERROR', 'Bewertung fehlgeschlagen. Bitte erneut versuchen.'));
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrorMessage('');
  };

  if (!isLoggedIn) {
    return (
      <Fragment>
        <Typography variant="h4" textAlign="center">
          Reviews
        </Typography>
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
      <Typography variant="h4" textAlign="center">
        Reviews
      </Typography>

      <Box textAlign="center" sx={{ borderBottom: 1, borderColor: 'divider', pb: 3 }}>
        <Typography variant="h6" textAlign="center">
          {t('RATE', { shop: `${shop.name}` })}
        </Typography>

        <TextField
          id="outlined-multiline-static"
          label={t('YOUR_COMMENT')}
          name="comment"
          value={comment}
          onChange={handleCommentChange}
          multiline
          rows={3}
          sx={{ mb: 3, mt: 3, width: '50%' }}
          error={errorMessage.length > 0}
          helperText={errorMessage.length > 0 && errorMessage}
        />

        <Box sx={{ width: '50%', margin: '0 auto 24px', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button component="label" variant="outlined">
            {t(photoPreview ? 'CHANGE_PHOTO' : 'ADD_PHOTO')}
            <input hidden type="file" accept="image/*" onChange={handlePhotoChange} />
          </Button>
          {photoPreview && (
            <>
              <Box component="img" src={photoPreview} alt={t('REVIEW_PHOTO')} sx={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 2 }} />
              <Button color="error" onClick={clearSelectedPhoto}>
                {t('REMOVE_PHOTO')}
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 4, pb: 3, mb: 5, width: '50%', margin: 'auto', alignItems: 'center' }}>
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            sx={{ mb: 3, mt: 3 }}
          />
          <Button variant="contained" color="primary" onClick={handleClick} disabled={comment.trim().length === 0}>
            {t('SEND_REVIEW').toUpperCase()}
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};

export default Review;
