// @ts-nocheck
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Divider, Pagination, Rating, Stack, Typography } from '@mui/material';
/*import shops from '../../mocks/shops';*/
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import TodayIcon from '@mui/icons-material/Today';
import ReservationDialog from '../Reservation/ReservationDialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { shopsAPI } from '../../api/apiClient';
import { useTranslation } from 'react-i18next';
import { convertDateToTime } from '../../utils/time';

const FilterResults = ({ filter }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const locationName = location.state?.loc ?? 'near your location';

  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [sortValue, setSortValue] = useState((location.state && location.state.sortValue) || 'Suggested');
  const [openModal, setOpenModal] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const handleChange = (event) => {
    const value = event.target.value;
    setSortValue(value);
  };

  const getRatingLabel = (r) => {
    const rounded = Math.round(r * 2) / 2;
    const key = `RATING_${String(rounded).replace('.', '_')}`;
    return t(key);
  };

  const rating = (shop) => {
    const reviews = shop.reviews ?? [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((a, b) => a + b.rating, 0);
    return sum / reviews.length;
  };

  const apiFilter = useMemo(
    () => ({
      priceCategory: filter.priceCategory,
      targetAudience: filter.targetAudience,
      employeeCount: filter.employeeCount,
      openingDays: filter.openingDays,
      openingTime: filter.openingTime,
      closingTime: filter.closingTime,
      paymentMethods: filter.paymentMethods,
      drinks: filter.drinks,
      minRating: filter.minRating,
      availableDate: filter.dateAndTime ? filter.dateAndTime.format('YYYY-MM-DD') : null,
      availableFromTime: filter.dateAndTime ? filter.dateAndTime.format('HH:mm') : null,
    }),
    [
      filter.priceCategory,
      filter.targetAudience,
      filter.employeeCount,
      filter.openingDays,
      filter.openingTime,
      filter.closingTime,
      filter.paymentMethods,
      filter.drinks,
      filter.minRating,
      filter.dateAndTime,
    ]
  );

  // Debounced version — waits 500ms after last change before triggering API call
  const [debouncedFilter, setDebouncedFilter] = useState(apiFilter);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedFilter(apiFilter), 500);
    return () => clearTimeout(debounceRef.current);
  }, [apiFilter]);

  // > 0 (positiv): b vor a
  // < 0 (negativ): a vor b
  const sortFunction = (shopA, shopB) => {
    switch (sortValue) {
      case 'Suggested':
        if (shopA.recommended && !shopB.recommended) return -1;
        if (!shopA.recommended && shopB.recommended) return 1;
        return 0;
      case 'Best Ratings':
        return rating(shopB) - rating(shopA);
      case 'Most Ratings':
        return (shopB.reviews?.length ?? 0) - (shopA.reviews?.length ?? 0);
      default:
        return 0;
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const hasCoordinates = location.state?.lat != null && location.state?.lng != null;
      const response = hasCoordinates
        ? await shopsAPI.getWithinRadius(location.state.lat, location.state.lng, page - 1, 12, debouncedFilter)
        : await shopsAPI.getAll(page - 1, 12, debouncedFilter);
      const data = response.data;
      const loadedShops = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
      setShops(loadedShops);
      setTotalPages(data?.totalPages ?? 1);
      setTotalResults(data?.totalElements ?? loadedShops.length);
    } catch (error) {
      setShops([]);
      setTotalPages(1);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFilter, location.state?.lat, location.state?.lng, page]);

  const goToShop = (id) => {
    navigate(`/shops/${id}`);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedFilter, location.state?.lat, location.state?.lng]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sortedShops = [...shops].sort(sortFunction);

  return (
    <Fragment>
      <Box sx={{ flex: '4 1 0' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ width: '100%', m: '20px 0' }} gap={1}>
          <Typography variant="body1">
            {totalResults} {t('SHOPS_AVAILABLE_IN')} {locationName}
          </Typography>
          <FormControl>
            <InputLabel id="sort">{t('SORT')}</InputLabel>
            <Select labelId="sort" id="sort" value={sortValue} label={t('SORT')} onChange={handleChange} sx={{ width: '200px' }}>
              <MenuItem value="Suggested">{t('SUGGESTED')}</MenuItem>
              <MenuItem value="Best Ratings">{t('BEST_RATINGS')}</MenuItem>
              <MenuItem value="Most Ratings">{t('MOST_RATINGS')}</MenuItem>
              <MenuItem value="Distance">{t('DISTANCE')}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {isLoading && (
          <Stack alignItems="center" justifyContent="center" flexGrow="1">
            <CircularProgress />
          </Stack>
        )}
        {!isLoading && sortedShops.length === 0 && (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <Typography variant="body1">{t('NO_BARBERS_FOUND')}</Typography>
          </Stack>
        )}
        {!isLoading && sortedShops.length !== 0 && (
          <>
            {sortedShops.map((shop) => (
              <Box key={shop.id} sx={{ margin: '20px 0' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={3} sx={{ mb: '20px' }}>
                  <img
                    alt="shop logo"
                    src={shop.logo ? `data:image/jpeg;base64,${shop.logo}` : import.meta.env.VITE_BACKUP_IMAGE}
                    width="205px"
                    height="205px"
                    style={{
                      borderRadius: '4px',
                      boxShadow: '-2px 2px 6px rgba(0, 0, 0, 0.4)',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      cursor: 'pointer',
                      maxWidth: '100%',
                    }}
                    onClick={() => goToShop(shop.id)}
                  />
                  <Stack direction="column" spacing={1} sx={{ pb: '10px' }}>
                    <Typography variant="h6">{shop.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Rating readOnly precision={0.5} value={rating(shop)} />
                      <Typography variant="span" sx={{ fontWeight: 'bold' }}>
                        {getRatingLabel(rating(shop))}
                      </Typography>
                      <Typography variant="span">
                        ({shop.reviews.length} {t('REVIEWS')})
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px' }}>
                      <Typography
                        variant="span"
                        sx={{
                          color: shop.priceCategory === 1 || shop.priceCategory === 2 || shop.priceCategory === 3 ? 'black' : 'rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        &#8364;
                      </Typography>
                      <Typography
                        variant="span"
                        sx={{ color: shop.priceCategory === 2 || shop.priceCategory === 3 ? 'black' : 'rgba(0, 0, 0, 0.2)' }}
                      >
                        &#8364;
                      </Typography>
                      <Typography variant="span" sx={{ color: shop.priceCategory === 3 ? 'black' : 'rgba(0, 0, 0, 0.2)' }}>
                        &#8364;
                      </Typography>
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOnIcon sx={{ color: 'rgba(0, 0, 0, 0.7)' }} />
                      <Typography variant="body1">{shop.address}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <QueryBuilderIcon sx={{ color: 'rgba(0, 0, 0, 0.7)' }} />
                      <Typography variant="body1">
                        {convertDateToTime(shop.openingTime)} - {convertDateToTime(shop.closingTime)}
                      </Typography>
                    </Stack>
                    <Button
                      variant="contained"
                      onClick={() => setOpenModal(shop.id)}
                      endIcon={<TodayIcon />}
                      sx={{ maxWidth: 'fit-content', '& > span': { marginLeft: '14px' } }}
                    >
                      {t('BOOK_NOW')}
                    </Button>
                  </Stack>
                </Stack>

                <Divider />

                {openModal === shop.id && <ReservationDialog open={openModal === shop.id} handleClose={() => setOpenModal(undefined)} shop={shop} />}
              </Box>
            ))}
            {totalPages > 1 && (
              <Stack alignItems="center" sx={{ mt: 3, mb: 2 }}>
                <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
              </Stack>
            )}
          </>
        )}
      </Box>
    </Fragment>
  );
};

export default FilterResults;
