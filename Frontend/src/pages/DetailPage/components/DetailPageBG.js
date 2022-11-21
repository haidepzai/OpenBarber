import React from 'react'

import {
  Box,
} from '@mui/material'


const DetailPageBG = ({ img }) => {
  return (
    <Box sx={{
        backgroundSize: "cover",
        backgroundImage: `url(${img})`,
        backgroundPosition: "center center",
        
        width: "100%",
        height: "40vh",
        position: "absolute",
        top: 0, left: 0,
      }}
    />
  )
}

export default DetailPageBG