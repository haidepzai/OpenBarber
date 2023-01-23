import React, { useState } from 'react';
import { Box, Divider, Rating, Stack, Typography } from '@mui/material';
import shops from '../../mocks/shops';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';

const ratingNames = {
  5: 'Excellent',
  4.5: 'Very good',
  4: 'Good',
  3.5: 'A',
  3: 'OK',
  2.5: 'Mediocre',
  2: 'Poor',
  1.5: 'B',
  1: 'Hehe',
  0.5: '...',
  0: 'Not Recommended',
};

const FilterResults = ({ filter }) => {
  const [sortValue, setSortValue] = useState('Suggested');

  const handleChange = (event) => {
    setSortValue(event.target.value);
  };

  const sortFunction = (shopA, shopB) => {
    switch (sortValue) {
      case 'Suggested':
        return 0;
      case 'Best Rating':
        return shopB.rating - shopA.rating;
      case 'Most Ratings':
        return shopB.reviews - shopA.reviews;
      case 'Distance':
        return 0;
      default:
        return 0;
    }
  };

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
      {shops.sort(sortFunction).map((shop) => (
        <Box sx={{ margin: '20px 0' }}>
          <Stack direction="row" sx={{ mb: '20px' }} spacing={2}>
            <img src={shop.image} width="205px" height="205px" style={{ borderRadius: '4px', boxShadow: '-2px 2px 6px rgba(0, 0, 0, 0.4)' }} />
            <Stack direction="column" spacing={1}>
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
                <Typography variant="body1">{shop.location}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <QueryBuilderIcon sx={{ color: 'rgba(0, 0, 0, 0.7)' }} />
                {/* shop.openingTime & shop.closingTime */}
                <Typography variant="body1">10:00 am - 8:00 pm</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Divider fullWidth />
        </Box>
      ))}
    </Box>
  );
};

export default FilterResults;
