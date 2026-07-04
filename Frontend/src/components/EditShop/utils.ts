import apiClient from '../../api/apiClient';
import { API_ENDPOINTS } from '../../config/constants';
import { getAccessToken } from '../../context/tokenStorage';

const mapServiceForSave = (service) => ({
  id: service.id,
  title: service.title,
  targetAudience: service.targetAudience,
  durationInMin: Number(service.durationInMin),
  price: Number(service.price),
});

export const buildShopSavePayload = (shop) => ({
  id: shop.id,
  name: shop.name,
  owner: shop.owner,
  address: shop.address,
  addressLongitude: shop.addressLongitude,
  addressLatitude: shop.addressLatitude,
  email: shop.email,
  phoneNumber: shop.phoneNumber,
  openingTime: shop.openingTime,
  closingTime: shop.closingTime,
  openingDays: shop.openingDays || [],
  website: shop.website,
  recommended: shop.recommended,
  approved: shop.approved,
  priceCategory: shop.priceCategory,
  paymentMethods: shop.paymentMethods || [],
  drinks: shop.drinks || [],
  services: (shop.services || []).map(mapServiceForSave),
});

export const loadShopData = async (email) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SHOPS_BY_EMAIL, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error('Error loading shop:', error);
    return null;
  }
};

export const saveShopData = async (shop) => {
  try {
    const payload = buildShopSavePayload(shop);
    const response = await apiClient.put(API_ENDPOINTS.SHOP_DETAIL(shop.id), payload, {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    if (response.status < 200 || response.status >= 300) throw new Error('Failed to save shop');
    return response.data;
  } catch (error) {
    console.error('Error saving shop:', error);
    return false;
  }
};

export const loadUserData = async (userId) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.USER_GET(userId));
    return response.data;
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
};
