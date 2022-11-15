import React from 'react'

import {
  Box,
} from '@mui/material'


const DetailPageBG = ({ img }) => {
  return (
    <Box className='detailPageBG' sx={{ backgroundImage: `url(${img})` }} />
  )
}

export default DetailPageBG