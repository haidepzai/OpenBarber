// @ts-nocheck
import React, { useState } from 'react';
import { Box, Button, Rating, Stack, Tab, Tabs, Typography } from '@mui/material';
import GoogleMaps from '../../components/GoogleMaps';
import ReservationDialog from '../../components/Reservation/ReservationDialog';
import PhotoGallery from '../../components/Gallery/PhotoGallery';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { convertDateToTime } from '../../utils/time';
import { useTranslation } from 'react-i18next';
import { servicesAPI } from '../../api/apiClient';

const TabPanel = ({ children, value, index, ...props }) => (value === index ? <Box {...props}>{children}</Box> : null);

const ShopInfoCard = ({ shop, mobile, reviews = [] }) => {
  const [tab, setTab] = useState(0);
  const [openReservationDialog, setOpenReservationDialog] = useState(false);
  const [services, setServices] = React.useState([]);
  const { t } = useTranslation();

  React.useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesRes = await servicesAPI.getByShop(shop.id);
        setServices(servicesRes.data);
      } catch (error) {
        setServices([]);
      }
    };
    loadServices();
  }, [shop.id]);

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
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)' },
          gap: { xs: 2, md: 3 },
          zIndex: 10,
          backgroundColor: 'background.paper',
          borderRadius: 6,
          p: { xs: 2, sm: 3, md: 4 },
          boxShadow: 4,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <Box>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
              {shop.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Rating readOnly precision={0.5} value={rating()} sx={{ color: 'primary.main' }} size="small" />
              <Typography fontSize={14} component="span" color="grey.600">
                {reviews.length} {t('REVIEWS')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant={mobile ? 'scrollable' : 'fullWidth'} scrollButtons="auto">
              <Tab label={t('GENERAL')} />
              <Tab label={t('SERVICES')} />
              <Tab label={t('CONTACT')} />
            </Tabs>
          </Box>

          <TabPanel value={tab} index={0} sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
              <AccessTimeIcon />
              <Typography variant="h6">{t('OPENING_HOURS')}:</Typography>
              <Typography variant="h6">
                {shop.openingTime ? convertDateToTime(shop.openingTime) : 'N/A'} - {shop.closingTime ? convertDateToTime(shop.closingTime) : 'N/A'}
              </Typography>
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={0.5}>
              {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => {
                const isOpen = shop.openingDays?.includes(day);
                return (
                  <Typography
                    key={day}
                    variant="body2"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '100vw',
                      fontWeight: 600,
                      fontSize: '13px',
                      backgroundColor: isOpen ? 'primary.main' : 'grey.200',
                      color: isOpen ? 'primary.contrastText' : 'text.disabled',
                    }}
                  >
                    {t(day)}
                  </Typography>
                );
              })}
            </Stack>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" mb={1} sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: 1 }}>
                {t('ABOUT').toUpperCase()}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
                {shop.description}
              </Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={() => setOpenReservationDialog(true)} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {t('BOOK_NOW')}
            </Button>
          </TabPanel>

          <TabPanel value={tab} index={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
            {services
              .sort((a, b) => a.targetAudience?.toLowerCase().localeCompare(b.targetAudience?.toLowerCase()))
              .map((service, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    backgroundColor: 'grey.200',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                  }}
                >
                  <Typography component="span" color="primary.main" sx={{ fontWeight: 600 }}>
                    {service.price}&euro;
                  </Typography>
                  <Typography component="span" sx={{ fontWeight: 500 }}>
                    {service.targetAudience}
                  </Typography>
                  <Typography component="span" sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto' } }}>
                    {service.title}
                  </Typography>
                </Box>
              ))}
          </TabPanel>

          <TabPanel value={tab} index={2} sx={{ display: 'grid', gap: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' },
                gap: 1.5,
                alignItems: 'start',
              }}
            >
              <Typography variant="body1" fontWeight={600}>
                {t('ADDRESS')}:
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
                {shop.address}
              </Typography>

              <Typography variant="body1" fontWeight={600}>
                {t('PHONE_NUMBER')}:
              </Typography>
              <Typography variant="body1">{shop.phoneNumber}</Typography>

              <Typography variant="body1" fontWeight={600}>
                {t('EMAIL')}:
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
                {shop.email}
              </Typography>

              <Typography variant="body1" fontWeight={600}>
                {t('WEBSITE')}:
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
                {shop.website}
              </Typography>
            </Box>
          </TabPanel>
        </Box>

        <Box sx={{ display: 'grid', gap: { xs: 2, md: 3 } }}>
          <Box sx={{ backgroundColor: 'grey.400', borderRadius: 2, p: 0, boxShadow: 2, minHeight: { xs: 220, sm: 260, md: 300 } }}>
            <GoogleMaps lat={shop.addressLatitude} lng={shop.addressLongitude} />
          </Box>

          <PhotoGallery
            pictures={shop.pictures}
            reviewPhotos={reviews.filter((review) => review.reviewPhotoData).map((review) => review.reviewPhotoData)}
          />
        </Box>
      </Box>

      <ReservationDialog open={openReservationDialog} handleClose={() => setOpenReservationDialog(false)} shop={shop} />
    </>
  );
};

export default ShopInfoCard;
