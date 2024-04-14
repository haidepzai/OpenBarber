import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Divider, Rating, Stack, Typography } from '@mui/material';
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

const ratingNames = {
  5: 'Excellent',
  4.5: 'Very good',
  4: 'Good',
  3.5: 'Very Acceptable',
  3: 'OK',
  2.5: 'Mediocre',
  2: 'Slightly Underwhelming',
  1.5: 'Underwhelming',
  1: 'Poor',
  0.5: 'Not Recommended',
  0: 'Bad',
};

const FilterResults = ({ filter }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const locationName = location.state?.loc ?? 'near your location';

  const [shops, setShops] = useState([]);
  const [sortValue, setSortValue] = useState((location.state && location.state.sortValue) || 'Suggested');
  const [openModal, setOpenModal] = useState();

  const handleChange = (event) => {
    const value = event.target.value;
    setSortValue(value);
  };

  // true --> element stays in array
  // false --> element is taken out
  const filterFunction = (shop, index, array) => {
    const availableServiceTargetAudience = [...new Set(shop.services.map((service) => service.targetAudience))];
    const employeeCount = shop.employees.length;

    return (
      // priceCategory
      (filter.priceCategory.length === 0 || filter.priceCategory.includes(shop.priceCategory)) &&
      // targetAudience
      (filter.targetAudience.length === 0 || filter.targetAudience.every((ta) => availableServiceTargetAudience.includes(ta))) &&
      // employeeCount
      (filter.employeeCount[1] < 20
        ? employeeCount >= filter.employeeCount[0] && employeeCount <= filter.employeeCount[1]
        : employeeCount >= filter.employeeCount[0]) &&
      // hours
      (!filter.openingTime ||
        dayjs(shop.openingTime).isBefore(filter.openingTime, 'minute') ||
        dayjs(shop.openingTime).isSame(filter.openingTime, 'minute')) &&
      (!filter.closingTime ||
        dayjs(shop.closingTime).isAfter(filter.closingTime, 'minute') ||
        dayjs(shop.closingTime).isSame(filter.closingTime, 'minute')) &&
      // paymentMethods
      (filter.paymentMethods.length === 0 || filter.paymentMethods.every((pm) => shop.paymentMethods.includes(pm))) &&
      // drinks
      (filter.drinks.length === 0 || filter.drinks.every((drink) => shop.drinks.includes(drink)))
    );
  };

  // > 0 (positiv): b vor a
  // < 0 (negativ): a vor b
  const sortFunction = (shopA, shopB) => {
    switch (sortValue) {
      case 'Suggested':
        if (shopA.recommended && !shopB.recommended) {
          return -1;
        } else if (shopA.recommended === shopB.recommended) {
          return 0;
        } else {
          return 1;
        }
      case 'Best Ratings':
        return rating(shopB) - rating(shopA);
      case 'Most Ratings':
        return shopB.reviews.length - shopA.reviews.length;
      default:
        return 0;
    }
  };

  const loadData = useCallback(async () => {
    if (location.state.lat !== undefined && location.state.lng !== undefined) {
      const shops = await getEnterprisesWithinRadius(location.state?.lat, location.state?.lng);
      setShops(shops);
    } else {
      const shops = await getEnterprises();
      setShops(shops);
    }
  }, [location.state]);

  const rating = (shop) => {
    const sum = shop.reviews.map((review) => review.rating).reduce((a, b) => a + b, 0);
    const avg = sum / shop.reviews.length || 0;
    return avg;
  };

  const goToShop = (id) => {
    navigate(`/shops/${id}`);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Fragment>
      <Box sx={{ flex: '4 1 0' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', m: '20px 0' }}>
          <Typography variant="body1">
            {shops.length} {t('SHOPS_AVAILABLE_IN')} {locationName}
          </Typography>
          <FormControl>
            <InputLabel id="sort">Sort</InputLabel>
            <Select labelId="sort" id="sort" value={sortValue} label="Sort" onChange={handleChange} sx={{ width: '200px' }}>
              <MenuItem value="Suggested">{t('SUGGESTED')}</MenuItem>
              <MenuItem value="Best Ratings">{t('BEST_RATINGS')}</MenuItem>
              <MenuItem value="Most Ratings">{t('MOST_RATINGS')}</MenuItem>
              <MenuItem value="Distance">{t('DISTANCE')}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {(shops.length === 0 || shops === undefined) && (
          <Stack alignItems="center" justifyContent="center" flexGrow="1">
            <CircularProgress />
          </Stack>
        )}
        {shops.length !== 0 && (
          <>
            {shops
              .filter(filterFunction)
              .sort(sortFunction)
              .map((shop) => (
                <Box key={shop.id} sx={{ margin: '20px 0' }}>
                  <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: '20px' }}>
                    <img
                      alt="shop logo"
                      src={shop.logo ? URL.createObjectURL(shop.logo) : process.env.REACT_APP_BACKUP_IMAGE}
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
                          {ratingNames[rating(shop)]}
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
                          {dayjs(shop.openingTime).format('hh:mm A')} - {dayjs(shop.closingTime).format('hh:mm A')}
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
          </>
        )}
      </Box>
    </Fragment>
  );
};

export default FilterResults;
