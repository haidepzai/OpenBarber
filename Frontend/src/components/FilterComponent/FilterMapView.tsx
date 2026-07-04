// @ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Rating, Stack, Typography } from '@mui/material';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { shopsAPI } from '../../api/apiClient';
import { useTranslation } from 'react-i18next';
import { reverseGeocode } from '../../utils/geocoding';

const MAP_CONTAINER_STYLE = { width: '100%', height: '600px' };
const DEFAULT_CENTER = { lat: 48.783333, lng: 9.183333 };

const avgRating = (shop) => {
  const reviews = shop.reviews ?? [];
  if (reviews.length === 0) return null;
  return reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
};

const FilterMapView = ({ filter }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapRef, setMapRef] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API,
  });

  const loadAllShops = useCallback(async () => {
    setIsLoading(true);
    try {
      const hasCoordinates = location.state?.lat != null && location.state?.lng != null;
      // Load all pages to show all shops on map (up to 100)
      const response = hasCoordinates
        ? await shopsAPI.getWithinRadius(location.state.lat, location.state.lng, 0, 100, filter)
        : await shopsAPI.getAll(0, 100, filter);
      const data = response.data;
      const loaded = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
      setShops(loaded.filter((s) => s.addressLatitude && s.addressLongitude));

      if (hasCoordinates) {
        setMapCenter({ lat: location.state.lat, lng: location.state.lng });
      } else if (loaded.length > 0 && loaded[0].addressLatitude) {
        setMapCenter({ lat: loaded[0].addressLatitude, lng: loaded[0].addressLongitude });
      }
    } catch {
      setShops([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, location.state?.lat, location.state?.lng]);

  useEffect(() => {
    loadAllShops();
  }, [loadAllShops]);

  const handleSearchInArea = async () => {
    if (!mapRef) return;
    const center = mapRef.getCenter();
    const lat = center.lat();
    const lng = center.lng();
    const loc = await reverseGeocode(lat, lng).catch(() => `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    navigate('/filter', {
      state: {
        ...location.state,
        lat,
        lng,
        loc,
      },
    });
  };

  if (isLoading || !isLoaded) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: 400 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Search in area button */}
      <Box sx={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleSearchInArea}
          sx={{
            backgroundColor: 'white',
            color: 'white',
            boxShadow: 2,
            '&:hover': { color: 'black', backgroundColor: '#f5f5f5' },
          }}
        >
          {t('SEARCH_IN_AREA')}
        </Button>
      </Box>

      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={mapCenter}
        zoom={13}
        onLoad={(map) => setMapRef(map)}
        onClick={() => setSelectedShop(null)}
      >
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={{ lat: shop.addressLatitude, lng: shop.addressLongitude }}
            title={shop.name}
            onClick={() => setSelectedShop(shop)}
          />
        ))}

        {selectedShop && (
          <InfoWindow
            position={{ lat: selectedShop.addressLatitude, lng: selectedShop.addressLongitude }}
            onCloseClick={() => setSelectedShop(null)}
            options={{ disableAutoPan: false }}
          >
            <Box
              onClick={() => navigate(`/shops/${selectedShop.id}`)}
              sx={{
                width: 200,
                cursor: 'pointer',
                borderRadius: 1,
                overflow: 'hidden',
                '&:hover': { opacity: 0.85 },
              }}
            >
              <Box
                component="img"
                src={selectedShop.logo ? `data:image/jpeg;base64,${selectedShop.logo}` : import.meta.env.VITE_BACKUP_IMAGE}
                sx={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
              />
              <Box sx={{ p: '8px 10px 10px' }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {selectedShop.name}
                </Typography>
                {avgRating(selectedShop) !== null && (
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.25}>
                    <Rating value={avgRating(selectedShop)} precision={0.5} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                      ({selectedShop.reviews?.length ?? 0})
                    </Typography>
                  </Stack>
                )}
                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                  {selectedShop.address}
                </Typography>
              </Box>
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        {shops.length} {t('SHOPS_AVAILABLE_IN')} {location.state?.loc ?? t('NEAR_YOU')}
      </Typography>
    </Box>
  );
};

export default FilterMapView;
