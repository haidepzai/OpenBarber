import React, { useState } from 'react';
import Search from '../components/Search';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterResults from '../components/FilterComponent/FilterResults';
import Filter from '../components/FilterComponent/Filter';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

const FilterPage = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [filter, setFilter] = useState({
    dateAndTime: location.state && location.state.dateAndTime ? dayjs(location.state.dateAndTime) : dayjs(),
    location: location.state?.loc || '',
    addressLatitude: location.state?.lat,
    addressLongitude: location.state?.lng,
    priceCategory: (location.state && location.state.priceCategory) || [],
    targetAudience: [],
    employeeCount: [0, 20],
    openingTime: null,
    closingTime: null,
    openingDays: [],
    paymentMethods: [],
    drinks: [],
    recommended: true,
    region: [],
    minRating: null,
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
      {isMobile ? (
        <Box sx={{ padding: '16px' }}>
          <Accordion elevation={1} disableGutters sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Filter</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Filter filter={filter} setFilter={setFilter} />
            </AccordionDetails>
          </Accordion>
          <FilterResults filter={filter} />
        </Box>
      ) : (
        <Stack direction="row" spacing={4} sx={{ maxWidth: '1500px', margin: '0 auto', padding: '0px 50px' }}>
          <Filter filter={filter} setFilter={setFilter} />
          <FilterResults filter={filter} />
        </Stack>
      )}
    </>
  );
};

export default FilterPage;
