import React, { useState } from 'react';

import { Box, Button, Rating, Tabs, Tab, Typography } from '@mui/material';
import GoogleMaps from '../../../components/GoogleMaps';
import ReservationDialog from '../../../components/Reservation/ReservationDialog';
import PhotoGallery from '../../../components/Gallery/PhotoGallery';

const TabPanel = ({ children, value, index, ...props }) => (value === index ? <Box {...props}>{children}</Box> : null);

const ShopInfoCard = ({ shop, mobile }) => {
  const [tab, setTab] = useState(0);
  const [openReservationDialog, setOpenReservationDialog] = useState(false);

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
              <Rating readOnly precision={0.5} value={shop.rating} sx={{ color: 'primary.main' }} size="small" />
              <Typography fontSize={14} variant="span" color="grey.600">
                {shop.reviews.length} Reviews
              </Typography>
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
              <Tab label="General" />
              <Tab label="Services" />
              <Tab label="Contact" />
            </Tabs>
          </Box>

          <TabPanel value={tab} index={0} sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
            <Typography variant="span">Open Hours: {shop.hours}</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h7" mb={1} sx={{ fontWeight: 600, color: 'grey.1000' }}>
                ABOUT
              </Typography>
              <Typography variant="body1">{shop.description}</Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={() => setOpenReservationDialog(true)}>
              Book Now
            </Button>
          </TabPanel>

          <TabPanel value={tab} index={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
            {shop.services.map((service, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: 'grey.200',
                  borderRadius: '100vw',
                  px: 2,
                  py: 1,
                }}
              >
                <Typography variant="span" color="primary.main" sx={{ fontWeight: 600 }}>
                  {service.price}&euro;
                </Typography>
                <Typography variant="span">{service.name}</Typography>
              </Box>
            ))}
          </TabPanel>

          <TabPanel value={tab} index={2} sx={{ display: 'grid', gap: 2 }}>
            <Typography variant="span">{shop.address}</Typography>
            <Typography variant="span">{shop.phone}</Typography>
            <Typography variant="span">{shop.mail}</Typography>
          </TabPanel>
        </Box>

        <Box sx={{ backgroundColor: 'grey.400', borderRadius: 2, padding: 0, boxShadow: 2, minHeight: '300px' }}>
          <GoogleMaps />
        </Box>

        <PhotoGallery />
      </Box>

      <ReservationDialog open={openReservationDialog} handleClose={() => setOpenReservationDialog(false)} shop={shop} />
    </>
  );
};

export default ShopInfoCard;
