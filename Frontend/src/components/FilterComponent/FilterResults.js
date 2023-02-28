import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Rating, Stack, Typography } from '@mui/material';
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
import { useLocation } from 'react-router-dom';

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

  const [shops, setShops] = useState([]);
  const [sortValue, setSortValue] = useState(location.state.sortValue || 'Suggested');
  const [openReservationDialog, setOpenReservationDialog] = useState(false);

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
      (!filter.hours.open ||
        dayjs(shop.hours.open).isBefore(filter.hours.open, 'minute') ||
        dayjs(shop.hours.open).isSame(filter.hours.open, 'minute')) &&
      (!filter.hours.close ||
        dayjs(shop.hours.close).isAfter(filter.hours.close, 'minute') ||
        dayjs(shop.hours.close).isSame(filter.hours.close, 'minute')) &&
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
      case 'Best Rating':
        return shopB.rating - shopA.rating;
      case 'Most Ratings':
        return shopB.reviews - shopA.reviews;
      default:
        return 0;
    }
  };

  const loadData = async () => {
    const shopsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/enterprises`);
    const shopsData = await shopsResponse.json();
    setShops(shopsData);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box sx={{ flex: '4 1 0' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', m: '20px 0' }}>
        <Typography variant="body1">{shops.length} Barber Shops available near you / in Stuttgart</Typography>
        <FormControl>
          <InputLabel id="sort">Sort</InputLabel>
          <Select labelId="sort" id="sort" value={sortValue} label="Sort" onChange={handleChange} sx={{ width: '200px' }}>
            <MenuItem value="Suggested">Suggested</MenuItem>
            <MenuItem value="Best Rating">Best Rating</MenuItem>
            <MenuItem value="Most Ratings">Most Ratings</MenuItem>
            <MenuItem value="Distance">Distance</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {shops
        .filter(filterFunction)
        .sort(sortFunction)
        .map((shop) => (
          <Box key={shop.id} sx={{ margin: '20px 0' }}>
            <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: '20px' }}>
              <img
                src={shop.logo ? URL.createObjectURL(shop.logo) : process.env.REACT_APP_BACKUP_IMAGE}
                width="205px"
                height="205px"
                style={{ borderRadius: '4px', boxShadow: '-2px 2px 6px rgba(0, 0, 0, 0.4)', objectFit: 'cover', objectPosition: 'center' }}
              />
              <Stack direction="column" spacing={1} sx={{ pb: '10px' }}>
                <Typography variant="h6">{shop.name}</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating readOnly precision={0.5} value={shop.rating} />
                  <Typography variant="span" sx={{ fontWeight: 'bold' }}>
                    {ratingNames[shop.rating]}
                  </Typography>
                  <Typography variant="span">({shop.reviews} Reviews)</Typography>
                </Stack>
                <Typography variant="body1" sx={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px' }}>
                  <Typography
                    variant="span"
                    sx={{ color: shop.priceCategory === 1 || shop.priceCategory === 2 || shop.priceCategory === 3 ? 'black' : 'rgba(0, 0, 0, 0.2)' }}
                  >
                    &#8364;
                  </Typography>
                  <Typography variant="span" sx={{ color: shop.priceCategory === 2 || shop.priceCategory === 3 ? 'black' : 'rgba(0, 0, 0, 0.2)' }}>
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
                    {dayjs(shop.hours.open).format('hh:mm A')} - {dayjs(shop.hours.close).format('hh:mm A')}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  onClick={() => setOpenReservationDialog(true)}
                  endIcon={<TodayIcon />}
                  sx={{ maxWidth: 'fit-content', '& > span': { marginLeft: '14px' } }}
                >
                  Termin Buchen
                </Button>
              </Stack>
            </Stack>

            <Divider />

            <ReservationDialog open={openReservationDialog} handleClose={() => setOpenReservationDialog(false)} shop={shop} />
          </Box>
        ))}
    </Box>
  );
};

{
  /*fullWidth*/
}

export default FilterResults;
