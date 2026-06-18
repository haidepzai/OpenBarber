import { reviewsAPI } from '../api/apiClient';

export const createReview = async (review, enterpriseId) => {
  return reviewsAPI.create(enterpriseId, review);
};

export const createReviewWithUUID = async (review, enterpriseId, uuid) => {
  return reviewsAPI.create(enterpriseId, review);
};

export const createReviewAuth = async (review, enterpriseId) => {
  return reviewsAPI.create(enterpriseId, review);
};
