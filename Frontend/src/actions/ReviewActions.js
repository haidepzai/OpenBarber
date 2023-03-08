import axios from 'axios';

const reviewsUrl = `${process.env.REACT_APP_BACKEND_URL}/reviews/`;

export const createReview = async (review, enterpriseId) => {
  const config = {
    method: 'POST',
    params: { enterpriseId: enterpriseId },
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const response = await axios.post(`${reviewsUrl}new`, review, config);
    return response;
  } catch (err) {
    throw new Error('Could not create review');
  }
};

export const createReviewWithUUID = async (review, enterpriseId, uuid) => {
  const config = {
    method: 'POST',
    params: { enterpriseId: enterpriseId, reviewUuid: uuid },
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const response = await axios.post(reviewsUrl, review, config);
    return response;
  } catch (err) {
    throw new Error('Could not create review');
  }
};
