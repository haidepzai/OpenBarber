import React from 'react'

import {
    Box,
} from '@mui/material'

import ShopDetailView from './components/ShopDetailView';
import DetailPageBG from './components/DetailPageBG';

import "../../css/DetailPage/DetailPage.css"

const BARBER_SHOP = {
  name: "Barber Shop",
  address: "1234 Main St, New York, NY 10001",
  phone: "(123) 456-7890",
  hours: "Mon - Fri: 9am - 5pm",
  mail: "barbershop@barber.com",
  website: "www.barbershop.com",
  rating: 4.5,
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  gallery: [
    "https://media.istockphoto.com/photos/retro-styled-barbershop-picture-id638568556",
    "https://media.istockphoto.com/photos/retro-styled-barbershop-picture-id638568556",
    "https://media.istockphoto.com/photos/retro-styled-barbershop-picture-id638568556",
    "https://media.istockphoto.com/photos/retro-styled-barbershop-picture-id638568556",
    "https://media.istockphoto.com/photos/retro-styled-barbershop-picture-id638568556",
    "https://media.istockphoto.com/photos/retro-styled-barbershop-picture-id638568556",
  ],
  services: [
    {
      name: "Haircut",
      price: 20,
    },
    {
      name: "Beard Trim",
      price: 10,
    },
    {
      name: "Shave",
      price: 15,
    },
  ],
  reviews: [
    {
      name: "John Doe",
      rating: 5,
      date: "2021-10-01",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      name: "Jane Doe",
      rating: 4,
      date: "2021-10-01",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      name: "John Doe",
      rating: 5,
      date: "2021-10-01",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    }
  ]
}


const DetailPage = () => {
  return (
    <Box className="detailPage" sx={{ position: "relative" }}>
      <DetailPageBG img={BARBER_SHOP.gallery[0]} />
      <ShopDetailView shop={BARBER_SHOP} />
    </Box>
  )
}

export default DetailPage