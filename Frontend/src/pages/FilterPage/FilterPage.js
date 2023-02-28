import React, { useState } from 'react';
import Search from '../../layout/Search';
import { Box, Stack } from '@mui/material';
import FilterResults from '../../components/FilterComponent/FilterResults';
import Filter from '../../components/FilterComponent/Filter';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

const FilterPage = () => {
  const location = useLocation();

  const [filter, setFilter] = useState({
    dateAndTime: location.state && location.state.dateAndTime ? dayjs(location.state.dateAndTime) : dayjs(),
    location: '',
    priceCategory: (location.state && location.state.priceCategory) || [],
    targetAudience: [],
    employeeCount: [0, 20],
    openingTime: null,
    closingTime: null,
    paymentMethods: [],
    drinks: [],
    recommended: true,
    region: [],
  });

  const setDateAndTime = (newValue) => {
    setFilter({
      ...filter,
      dateAndTime: newValue,
    });
  };

  return (
    <>
      <Box sx={{ background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(93,71,58,1) 0%, rgba(160,142,131,1) 100%)', p: '20px 0' }}>
        <Search dateAndTime={filter.dateAndTime} setDateAndTime={setDateAndTime} />
      </Box>
      <Stack direction="row" spacing={4} sx={{ maxWidth: '1500px', margin: '0 auto', padding: '0px 50px' }}>
        <Filter filter={filter} setFilter={setFilter} />
        <FilterResults filter={filter} />
      </Stack>
    </>
  );
};

export default FilterPage;
