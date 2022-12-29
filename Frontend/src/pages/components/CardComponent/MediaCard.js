import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function MediaCard({image, title, rating, description}) {

  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 250, borderRadius: 3 }}>
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt="Barber"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" onClick={() => navigate("/shops")} sx={{ "&:hover": { cursor: "pointer"} }}>
          {title}
        </Typography>


          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating readOnly precision={0.5} value={rating} sx={{ color: 'primary.main' }} size="small" />
          <Typography variant="span" style={{ fontWeight: 600 }} color="grey.400">
            5 Reviews
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
          color="text.secondary">
           {description}
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant="contained" color="primary">Book Now</Button>
      </CardActions>
    </Card>
  );
}
