import { useState } from 'react';

import { Box, Button, Rating, Tabs, Tab, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
// import { TabPanel } from '@mui/lab';

const TabPanel = ({ children, value, index, ...props }) => (value === index ? <Box {...props}>{children}</Box> : null);

const AVATAR_URL = 'https://www.shareicon.net/data/2016/09/15/829473_man_512x512.png';

const ShopDetailView = ({ shop }) => {
  const [tab, setTab] = useState(0);

  return (
    <Box className="shopDetailView-container">
      <Box className="shopDetailView" sx={{ backgroundColor: 'background.paper', borderRadius: 6, padding: 4, boxShadow: 4, gap: 2 }}>
        <Box sx={{ gridRow: '1 / 3', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h4">{shop.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating readOnly precision={0.5} value={shop.rating} sx={{ color: 'primary.main' }} size="small" />
              <Typography variant="span" style={{ fontWeight: 600 }} color="grey.400">
                {shop.reviews.length} Reviews
              </Typography>
            </Box>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
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
            <Button variant="contained" color="primary">
              Book Now
            </Button>
          </TabPanel>
          <TabPanel value={tab} index={1} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {shop.services.map((service, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: 'grey.200',
                  borderRadius: '100vw',
                  padding: 2,
                  paddingBottom: 1,
                  paddingTop: 1,
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
        <Box sx={{ backgroundColor: 'grey.400', borderRadius: 2, padding: 2 }}>Map</Box>
        <Box sx={{ backgroundColor: 'grey.400', borderRadius: 2, padding: 2 }}>Gallery</Box>
      </Box>

      <Typography variant="h4" mt={4}>
        Reviews
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {shop.reviews.map((review) => (
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              paddingTop: 3,
              paddingBottom: 3,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              <Box
                boxShadow={2}
                sx={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '50%',
                  backgroundImage: `url(${AVATAR_URL})`,
                  backgroundSize: 'cover',
                }}
              ></Box>
              <Rating readOnly precision={0.5} value={review.rating} sx={{ color: 'primary.main' }} size="small" />
              <Typography variant="span" color="grey.400">
                {review.date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h5">
                <Typography variant="span" sx={{ fontWeight: 600 }}>
                  {review.name}
                </Typography>
                &nbsp;wrote:
              </Typography>
              <Typography variant="body1">{review.comment}</Typography>
              <Typography variant="span" color="grey.400" mt="auto">
                {review.name} has added 0 photos to the gallery.
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ShopDetailView;
