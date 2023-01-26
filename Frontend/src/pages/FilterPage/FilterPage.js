import React, { useState } from 'react';
import Search from '../../layout/Search';
import { Box, Divider, Stack } from '@mui/material';
import barberShops from '../../mocks/shops';
import FilterResults from '../../components/FilterComponent/FilterResults';
import Filter from '../../components/FilterComponent/Filter';

const FilterPage = ({}) => {
  const [filter, setFilter] = useState({
    location: '',
    priceCategory: [],
    genders: [],
    stylistCount: [0, 50],
    openingHours: [0, 12],
    paymentMethods: {
      onSiteCash: false,
      onSiteCard: false,
      payPal: false,
      bank_transfer: false,
    },
    drinks: {
      coffee: false,
      tea: false,
      water: false,
      soft_drinks: false,
      beer: false,
      champagne: false,
      sparkling_wine: false,
    },
    recommended: true,
    region: [],
  });

  return (
    <>
      <Box sx={{ background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(93,71,58,1) 0%, rgba(160,142,131,1) 100%)', p: '20px 0' }}>
        <Search />
      </Box>
      <Stack direction="row" spacing={4} sx={{ maxWidth: '1500px', margin: '0 auto', padding: '0px 50px' }}>
        <Filter filter={filter} setFilter={setFilter} />
        <FilterResults filter={filter} />
      </Stack>
    </>
  );
};

export default FilterPage;
