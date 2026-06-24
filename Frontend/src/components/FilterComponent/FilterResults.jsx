import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Divider, Pagination, Rating, Stack, Typography } from '@mui/material';
/*import shops from '../../mocks/shops';*/
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import dayjs from 'dayjs';
import TodayIcon from '@mui/icons-material/Today';
import ReservationDialog from '../Reservation/ReservationDialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEnterprisesWithinRadius, getEnterprises } from '../../actions/EnterpriseActions';
import { useTranslation } from 'react-i18next';
import { convertDateToTime } from '../../shared/ConvertTime';

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

  // true --> element stays in array
  // false --> element is taken out
  const filterFunction = (shop) => {
    const availableServiceTargetAudience = [...new Set((shop.services ?? []).map((service) => service.targetAudience))];
    const employeeCount = shop.employees?.length ?? 0;

    return (
      // priceCategory
      (filter.priceCategory.length === 0 || filter.priceCategory.includes(shop.priceCategory)) &&
      // targetAudience
      (filter.targetAudience.length === 0 || filter.targetAudience.every((ta) => availableServiceTargetAudience.includes(ta))) &&
      // employeeCount
      (filter.employeeCount[1] < 20
        ? employeeCount >= filter.employeeCount[0] && employeeCount <= filter.employeeCount[1]
        : employeeCount >= filter.employeeCount[0]) &&
      // opening days
      (filter.openingDays.length === 0 ||
        filter.openingDays.every((day) => (shop.openingDays ?? []).includes(day))) &&
      // hours – prefix HH:mm strings with a fixed date so dayjs can parse them
      (!filter.openingTime ||
        dayjs(`1970-01-01T${shop.openingTime}`).isBefore(filter.openingTime, 'minute') ||
        dayjs(`1970-01-01T${shop.openingTime}`).isSame(filter.openingTime, 'minute')) &&
      (!filter.closingTime ||
        dayjs(`1970-01-01T${shop.closingTime}`).isAfter(filter.closingTime, 'minute') ||
        dayjs(`1970-01-01T${shop.closingTime}`).isSame(filter.closingTime, 'minute')) &&
      // paymentMethods
      (filter.paymentMethods.length === 0 || filter.paymentMethods.every((pm) => (shop.paymentMethods ?? []).includes(pm))) &&
      // drinks
      (filter.drinks.length === 0 || filter.drinks.every((drink) => (shop.drinks ?? []).includes(drink)))
    );
  };

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
      const data = hasCoordinates
        ? await getEnterprisesWithinRadius(location.state.lat, location.state.lng, page - 1)
        : await getEnterprises(page - 1);
      setShops(Array.isArray(data?.content) ? data.content : []);
      setTotalPages(data?.totalPages ?? 1);
    } catch (error) {
      setShops([]);
    } finally {
      setIsLoading(false);
    }
  }, [location.state, page]);

  const goToShop = (id) => {
    navigate(`/shops/${id}`);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredShops = shops.filter(filterFunction).sort(sortFunction);

  return (
    <Fragment>
      <Box sx={{ flex: '4 1 0' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', m: '20px 0' }}>
          <Typography variant="body1">
            {filteredShops.length} {t('SHOPS_AVAILABLE_IN')} {locationName}
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
        {!isLoading && filteredShops.length === 0 && (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <Typography variant="body1">{t('NO_BARBERS_FOUND')}</Typography>
          </Stack>
        )}
        {!isLoading && filteredShops.length !== 0 && (
          <>
            {filteredShops
              .map((shop) => (
                <Box key={shop.id} sx={{ margin: '20px 0' }}>
                  <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: '20px' }}>
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

                  {openModal === shop.id && (
                    <ReservationDialog open={openModal === shop.id} handleClose={() => setOpenModal(undefined)} shop={shop} />
                  )}
                </Box>
              ))}
            {totalPages > 1 && (
              <Stack alignItems="center" sx={{ mt: 3, mb: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Stack>
            )}
          </>
        )}
      </Box>
    </Fragment>
  );
};

export default FilterResults;
