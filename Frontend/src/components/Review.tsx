// @ts-nocheck
import React, { Fragment, useContext, useState } from 'react';

import { Box, Button, Rating, TextField, Typography } from '@mui/material';
import { createReviewAuth } from '../actions/ReviewActions';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/auth-context';

const Review = ({ shop, onReview }) => {
  const [value, setValue] = useState(1);
  const [comment, setComment] = useState('');
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const user = authCtx.user;

  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

  const handleClick = async () => {
    const authorName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || '';
    const reviewRequest = {
      author: authorName,
      comment: comment,
      rating: value,
      createdAt: new Date(),
    };
    try {
      await createReviewAuth(reviewRequest, shop.id);
      onReview(true);
    } catch (error) {
      setErrorMessage(t('REVIEW_ERROR', 'Bewertung fehlgeschlagen. Bitte erneut versuchen.'));
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
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
