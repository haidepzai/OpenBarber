import React, {useEffect, useState} from 'react';

import { Box } from '@mui/material';

import ShopDetailView from './components/ShopDetailView';
import DetailPageBG from './components/DetailPageBG';

import '../../css/DetailPage/DetailPage.css';
import {useParams} from "react-router-dom";

/*const BARBER_SHOP = {
  name: 'Barber Shop',
  address: '1234 Main St, New York, NY 10001',
  phone: '(123) 456-7890',
  hours: 'Mon - Fri: 9am - 5pm',
  mail: 'barbershop@barber.com',
  website: 'www.barbershop.com',
  rating: 4.5,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  gallery: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
  ],
  services: [
    {
      name: 'Haircut',
      price: 20,
    },
    {
      name: 'Beard Trim',
      price: 10,
    },
    {
      name: 'Shave',
      price: 15,
    },
  ],
  reviews: [
    {
      name: 'John Doe',
      rating: 5,
      date: '2021-10-01',
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      name: 'Jane Doe',
      rating: 4,
      date: '2021-10-01',
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      name: 'John Doe',
      rating: 5,
      date: '2021-10-01',
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  ],
};*/

const DetailPage = () => {

  const {routeId} = useParams();

  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(true);

  const loadShop = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/enterprises/${routeId}`);

    const responseData = await response.json();
    setShop(responseData);
  }

  useEffect(() => {
    loadShop().then(()=> setLoading(false));
  }, [])

  useEffect(() => {
    console.log(shop)
  }, [shop])

  return (
    <>
      {!loading &&
      <Box className="detailPage" sx={{ position: 'relative' }}>
        <DetailPageBG img={shop.logo} />
        <ShopDetailView shop={shop} />
      </Box>
      }
    </>
  );
};

export default DetailPage;
