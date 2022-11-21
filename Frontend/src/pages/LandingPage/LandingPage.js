import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import MediaCard from '../components/CardComponent/MediaCard';
import PlaceHolderComponent from './components/PlaceHolderComponent';

const LandingPage = () => {

  const barberShops = [
    {
      name: 'Barber Shop',
      rating: 4,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: "https://cdn.mdr.de/ratgeber/friseur-haare-schneiden-106_v-variantBig16x9_w-576_zc-915c23fa.jpg?version=27611",
    },
    {
      name: 'Barber Shop 2',
      rating: 4.5,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: "https://cdn.mdr.de/ratgeber/friseur-haare-schneiden-106_v-variantBig16x9_w-576_zc-915c23fa.jpg?version=27611",
    },
    {
      name: 'Barber Shop 3',
      rating: 5,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      image: "https://cdn.mdr.de/ratgeber/friseur-haare-schneiden-106_v-variantBig16x9_w-576_zc-915c23fa.jpg?version=27611",
    }

  ]


  return (
    <div>
    <p>Landing Page Placeholder</p>
    <PlaceHolderComponent />

    <Grid sx={{ flexGrow: 1 }} container>
      <Grid container justifyContent="center" spacing={5} >
        {barberShops.map(shop => (
          <Grid item >
            <MediaCard key={shop.name} title={shop.name} image={shop.image} rating={shop.rating} description={shop.description} />
          </Grid>
        )
        )}
      </Grid>
    </Grid>
    
  </div>
  );
};

export default LandingPage;
