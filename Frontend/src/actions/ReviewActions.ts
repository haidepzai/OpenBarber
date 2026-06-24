import { reviewsAPI } from '../api/apiClient';

export const createReview = async (review, shopId) => {
  return reviewsAPI.create(shopId, review);
};

export const createReviewWithUUID = async (review, shopId, uuid) => {
  return reviewsAPI.create(shopId, review);
};

export const createReviewAuth = async (review, shopId) => {
  const response = await reviewsAPI.create(shopId, review);
  return response.data;
};

export const updateReview = async (id, review) => {
  return reviewsAPI.update(id, review);
};

export const deleteReview = async (id) => {
  return reviewsAPI.delete(id);
};
