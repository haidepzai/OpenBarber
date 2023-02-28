import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Rating } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ReservationDialog from '../Reservation/ReservationDialog';
import { useState } from 'react';

export default function MediaCard({ /*image, title, rating, description, link, reviews*/ shop, setOpenReservationDialog }) {
  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setOpenReservationDialog(true);
  };

  const rating = () => {
    const sum = shop.reviews.map((review) => review.rating).reduce((a, b) => a + b, 0);
    const avg = sum / shop.reviews.length || 0;
    return avg;
  };

  return (
    <>
      <Card sx={{ maxWidth: 250, borderRadius: 3 }}>
        <CardActionArea component={RouterLink} to={`shops/${shop.id}`}>
          <CardMedia
            component="img"
            height="140"
            image={shop.logo ? URL.createObjectURL(shop.logo) : process.env.REACT_APP_BACKUP_IMAGE}
            alt="Barber"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {shop.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating readOnly precision={0.5} value={rating()} sx={{ color: 'primary.main' }} size="small" />
              <Typography variant="span" style={{ fontWeight: 600 }} color="grey.400">
                {shop.reviews.length} Review(s)
              </Typography>
            </Box>

            <Typography
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
              }}
              mt={2}
              variant="body2"
              color="text.secondary"
            >
              {shop.description} evhjre ve vpore kv revk vß0erk v0rek v0rke v0k re0vk re0vk r0ek vekivof disov f0v of v0df v0
              {shop.description} evhjre ve vpore kv revk vß0erk v0rek v0rke v0k re0vk re0vk r0ek vekivof disov f0v of v0df v0
              {shop.description} evhjre ve vpore kv revk vß0erk v0rek v0rke v0k re0vk re0vk r0ek vekivof disov f0v of v0df v0
              {shop.description} evhjre ve vpore kv revk vß0erk v0rek v0rke v0k re0vk re0vk r0ek vekivof disov f0v of v0df v0{shop.description} evhjre
              ve vpore kv revk vß0erk v0rek v0rke v0k re0vk re0vk r0ek vekivof disov f0v of v0df v0
              {shop.description} evhjre ve vpore kv revk vß0erk v0rek v0rke v0k re0vk re0vk r0ek vekivof disov f0v of v0df v0
            </Typography>
          </CardContent>

          <CardActions sx={{ p: '0 16px 16px 16px' }}>
            {/*onClick={() => setOpenReservationDialog(true)}*/}
            <Button variant="contained" color="primary" onClick={handleClick}>
              Book Now
            </Button>
          </CardActions>
        </CardActionArea>
      </Card>
    </>
  );
}
