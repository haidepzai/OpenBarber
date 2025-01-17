import React, { Fragment, useState } from 'react';

import { Box, Button, Rating, TextField, Typography } from '@mui/material';
import { createReviewAuth } from '../actions/ReviewActions';
import { useTranslation } from 'react-i18next';

const Review = ({ shop, onReview }) => {
  const [value, setValue] = useState(1);
  const [name, setName] = useState('');
  const [nameIsValid, setNameIsValid] = useState(true);
  const [comment, setComment] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

  const handleClick = async () => {
    const reviewRequest = {
      author: name,
      comment: comment,
      rating: value,
      createdAt: new Date(),
    };
    try {
      await createReviewAuth(reviewRequest, shop.id);
      onReview(true);
    } catch (error) {
      console.log(error.message);
      setErrorMessage('Please login to review');
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNameBlur = (event) => {
    if (event.target.value.length === 0) {
      setNameIsValid(false);
    } else {
      setNameIsValid(true);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
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

        <Box sx={{ display: 'flex', gap: 4, pb: 3, mb: 5, width: '50%', margin: 'auto' }}>
          <TextField
            label={t('YOUR_NAME')}
            name="name"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            fullWidth
            required
            error={!nameIsValid}
            helperText={!nameIsValid && 'Please enter a name'}
          />
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            sx={{ mb: 3, mt: 3 }}
          />
          <Button variant="contained" color="primary" onClick={handleClick} disabled={!nameIsValid || name.length === 0 || name.length === undefined}>
            {t('SEND_REVIEW').toUpperCase()}
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};

export default Review;
