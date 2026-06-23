import apiClient from '../../api/apiClient';
import {API_ENDPOINTS} from '../../config/constants.js';
import { getAccessToken } from '../../context/tokenStorage';

const mapServiceForSave = (service) => ({
    id: service.id,
    title: service.title,
    targetAudience: service.targetAudience,
    durationInMin: Number(service.durationInMin),
    price: Number(service.price),
});

export const buildEnterpriseSavePayload = (enterprise) => ({
    id: enterprise.id,
    name: enterprise.name,
    owner: enterprise.owner,
    address: enterprise.address,
    addressLongitude: enterprise.addressLongitude,
    addressLatitude: enterprise.addressLatitude,
    email: enterprise.email,
    phoneNumber: enterprise.phoneNumber,
    openingTime: enterprise.openingTime,
    closingTime: enterprise.closingTime,
    openingDays: enterprise.openingDays || [],
    website: enterprise.website,
    recommended: enterprise.recommended,
    approved: enterprise.approved,
    priceCategory: enterprise.priceCategory,
    paymentMethods: enterprise.paymentMethods || [],
    drinks: enterprise.drinks || [],
    services: (enterprise.services || []).map(mapServiceForSave),
});

export const loadEnterpriseData = async (email) => {
    try {
        const response = await apiClient.get(API_ENDPOINTS.ENTERPRISES_BY_EMAIL, {
            params: {email},
        });
        return response.data;
    } catch (error) {
        console.error('Error loading enterprise:', error);
        return null;
    }
};

export const saveEnterpriseData = async (enterprise) => {
    try {
        const payload = buildEnterpriseSavePayload(enterprise);
        const response = await apiClient.put(API_ENDPOINTS.ENTERPRISE_DETAIL(enterprise.id), payload, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        if (response.status < 200 || response.status >= 300) throw new Error('Failed to save enterprise');
        return response.data;
    } catch (error) {
        console.error('Error saving enterprise:', error);
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
