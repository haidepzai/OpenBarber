import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Rating, Tabs, Tab, Typography, Grid, Stack } from '@mui/material';
import GoogleMaps from '../../components/GoogleMaps';
import ReservationDialog from '../../components/Reservation/ReservationDialog';
import PhotoGallery from '../../components/Gallery/PhotoGallery';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { convertDateToTime } from '../../shared/ConvertTime';
import { useTranslation } from 'react-i18next';

const TabPanel = ({ children, value, index, ...props }) => (value === index ? <Box {...props}>{children}</Box> : null);

const ShopInfoCard = ({ shop, mobile }) => {
  const [tab, setTab] = useState(0);
  const [openReservationDialog, setOpenReservationDialog] = useState(false);

  const [reviews, setReviews] = React.useState([]);
  const [services, setServices] = React.useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/reviews?enterpriseId=' + shop.id)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.error('review request failed', err);
      });
    axios
      .get('http://localhost:8080/api/services?enterpriseId=' + shop.id)
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => {
        console.error('review request failed', err);
      });
  }, []);

  const rating = () => {
    const sum = reviews.map((review) => review.rating).reduce((a, b) => a + b, 0);
    const avg = sum / reviews.length || 0;
    return avg;
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: '1fr 1fr',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: 2,
          zIndex: 10,
          minHeight: '50vh',
          backgroundColor: 'background.paper',
          borderRadius: 6,
          padding: 4,
          boxShadow: 4,
        }}
      >
        <Box
          sx={{
            gridRow: '1 / 3',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: mobile ? 8 : 0,
          }}
        >
          <Box>
            <Typography variant="h4">{shop.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating readOnly precision={0.5} value={rating()} sx={{ color: 'primary.main' }} size="small" />
              <Typography fontSize={14} variant="span" color="grey.600">
                {reviews.length} {t('REVIEWS')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
              <Tab label={t('GENERAL')} />
              <Tab label={t('SERVICES')} />
              <Tab label={t('CONTACT')} />
            </Tabs>
          </Box>

          <TabPanel value={tab} index={0} sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon />
              <Typography variant="h6">{t('OPENING_HOURS')}:</Typography>
              <Typography variant="h6">
                {shop.openingTime ? convertDateToTime(shop.openingTime) : 'N/A'} - {shop.openingTime ? convertDateToTime(shop.closingTime) : 'N/A'}
              </Typography>
            </Stack>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h7" mb={1} sx={{ fontWeight: 600, color: 'grey.1000' }}>
                {t('ABOUT').toUpperCase()}
              </Typography>
              <Typography variant="body1">{shop.description}</Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={() => setOpenReservationDialog(true)}>
              {t('BOOK_NOW')}
            </Button>
          </TabPanel>

          <TabPanel value={tab} index={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
            {services
              .sort((a, b) => a.targetAudience?.toLowerCase().localeCompare(b.targetAudience?.toLowerCase()))
              .map((service, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: 'grey.200',
                    borderRadius: '100vw',
                    px: 2,
                    py: 1,
                  }}
                >
                  <Typography variant="span" color="primary.main" sx={{ fontWeight: 600, minWidth: '30px' }}>
                    {service.price}&euro;
                  </Typography>
                  <Typography variant="span" sx={{ width: '30px' }}>
                    {service.targetAudience}
                  </Typography>
                  <Typography variant="span">-</Typography>
                  <Typography variant="span">{service.title}</Typography>
                </Box>
              ))}
          </TabPanel>

          <TabPanel value={tab} index={2} sx={{ display: 'grid', gap: 2 }}>
            <Grid container columns={4} spacing={2}>
              <Grid item xs={1}>
                <Typography variant="body1">{t('ADDRESS')}:</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant="body1">{shop.address}</Typography>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={1}>
                <Typography variant="body1">{t('PHONE_NUMBER')}:</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant="body1">{shop.phoneNumber}</Typography>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={1}>
                <Typography variant="body1">{t('EMAIL')}:</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant="body1">{shop.email}</Typography>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={1}>
                <Typography variant="body1">{t('WEBSITE')}:</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant="body1">{shop.website}</Typography>
              </Grid>
              <Grid item xs={2} />
            </Grid>
          </TabPanel>
        </Box>

        <Box sx={{ backgroundColor: 'grey.400', borderRadius: 2, padding: 0, boxShadow: 2, minHeight: '300px' }}>
          <GoogleMaps lat={shop.addressLatitude} lng={shop.addressLongitude} />
        </Box>

        <PhotoGallery pictures={shop.pictures} />
      </Box>

      <ReservationDialog open={openReservationDialog} handleClose={() => setOpenReservationDialog(false)} shop={shop} />
    </>
  );
};

export default ShopInfoCard;
