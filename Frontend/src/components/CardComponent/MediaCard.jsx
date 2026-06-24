import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Rating } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function MediaCard({ shop, setOpenModal }) {
  const { t } = useTranslation();

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setOpenModal(shop.id);
  };

  const rating = () => {
    const sum = shop.reviews.map((review) => review.rating).reduce((a, b) => a + b, 0);
    const avg = sum / shop.reviews.length || 0;
    return avg;
  };

  return (
    <>
      <Card sx={{ width: 250, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
        <CardActionArea component={RouterLink} to={`shops/${shop.id}`} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'stretch' }}>
          <CardMedia
            component="img"
            height="140"
            image={shop.logo ? `data:image/jpeg;base64,${shop.logo}` : import.meta.env.VITE_BACKUP_IMAGE}
            alt="Barber"
            sx={{ flexShrink: 0 }}
          />
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                height: '3.2em',
              }}
            >
              {shop.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 24 }}>
              <Rating readOnly precision={0.5} value={rating()} sx={{ color: 'primary.main' }} size="small" />
              <Typography variant="span" style={{ fontWeight: 600 }} color="grey.400">
                {shop.reviews.length} {t('REVIEWS')}
              </Typography>
            </Box>

            <Typography
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                height: '2.6em',
              }}
              mt={2}
              variant="body2"
              color="text.secondary"
            >
              {shop.description} {shop.address}
            </Typography>
          </CardContent>

          <CardActions sx={{ p: '0 16px 16px 16px', flexShrink: 0 }}>
            <Button variant="contained" color="primary" onClick={handleClick}>
              {t('BOOK_NOW')}
            </Button>
          </CardActions>
        </CardActionArea>
      </Card>
    </>
  );
}
