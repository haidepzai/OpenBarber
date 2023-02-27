import React, { useState } from 'react';

import {Box, Button, Rating, Tabs, Tab, Typography, Grid, Stack} from '@mui/material';
import GoogleMaps from '../../../components/GoogleMaps';
import ReservationDialog from '../../../components/Reservation/ReservationDialog';
import PhotoGallery from '../../../components/Gallery/PhotoGallery';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from "dayjs";

const TabPanel = ({ children, value, index, ...props }) => (value === index ? <Box {...props}>{children}</Box> : null);

const ShopInfoCard = ({ shop, mobile }) => {
  const [tab, setTab] = useState(0);
  const [openReservationDialog, setOpenReservationDialog] = useState(false);

  const rating = () => {
      const sum = shop.reviews.map((review) => review.rating).reduce((a, b) => a + b, 0);
      const avg = (sum / shop.reviews.length) || 0;
      return avg;
  }

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
                {shop.reviews.length} Review(s)
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
            <Stack direction="row" alignItems="center" spacing={1}>
                <AccessTimeIcon />
                <Typography variant="h6">Opening Hours:</Typography>
                <Typography variant="h6" >{dayjs(shop.openingTime).format('hh:mm A')} - {dayjs(shop.closingTime).format('hh:mm A')}</Typography>
            </Stack>


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
            {shop.services
                .sort((a, b) => a.targetAudience.toLowerCase().localeCompare(b.targetAudience.toLowerCase()))
                .map((service, i) => (
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
                <Typography variant="span" color="primary.main" sx={{ fontWeight: 600, minWidth: "30px" }}>
                  {service.price}&euro;
                </Typography>
                <Typography variant="span" sx={{ width: "30px" }}>{service.targetAudience}</Typography>
                <Typography variant="span">-</Typography>
                <Typography variant="span">{service.title}</Typography>
              </Box>
            ))}
          </TabPanel>

          <TabPanel value={tab} index={2} sx={{ display: 'grid', gap: 2 }}>
              <Grid container columns={4} spacing={2}>
                  <Grid item xs={1}>
                      <Typography variant="body1">Adresse:</Typography>
                  </Grid>
                  <Grid item xs={1}>
                      <Typography variant="body1">{shop.address}</Typography>
                  </Grid>
                  <Grid item xs={2} />
                  <Grid item xs={1}>
                      <Typography variant="body1">Phone Number:</Typography>
                  </Grid>
                  <Grid item xs={1}>
                      <Typography variant="body1">{shop.phoneNumber}</Typography>
                  </Grid>
                  <Grid item xs={2} />
                  <Grid item xs={1}>
                      <Typography variant="body1">E-Mail:</Typography>
                  </Grid>
                  <Grid item xs={1}>
                      <Typography variant="body1">{shop.email}</Typography>
                  </Grid>
                  <Grid item xs={2} />
                  <Grid item xs={1}>
                      <Typography variant="body1">Webseite:</Typography>
                  </Grid>
                  <Grid item xs={1}>
                      <Typography variant="body1">{shop.website}</Typography>
                  </Grid>
                  <Grid item xs={2} />
              </Grid>
          </TabPanel>
        </Box>

        <Box sx={{ backgroundColor: 'grey.400', borderRadius: 2, padding: 0, boxShadow: 2, minHeight: '300px' }}>
          <GoogleMaps />
        </Box>

        <PhotoGallery pictures={shop.pictures} />
      </Box>

      <ReservationDialog open={openReservationDialog} handleClose={() => setOpenReservationDialog(false)} shop={shop} />
    </>
  );
};

export default ShopInfoCard;
