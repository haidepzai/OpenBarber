import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import beardImage from '../assets/beard.jpg';
import ratingsImage from '../assets/rating.jpg';
import mostImage from '../assets/most.jpg';
import priceImage from '../assets/price.jpg';
import locationImage from '../assets/location.jpg';
import tipsImage from '../assets/tips.jpg';
import { Typography, Box } from '@mui/material';

const shopImages = [
    { name: 'Best Ratings', src: ratingsImage },
    { name: 'Cheapest Prices', src: priceImage },
    { name: 'Near you', src: locationImage },
    { name: 'With Beard Trimming', src: beardImage },
    { name: 'Most Ratings', src: mostImage },
    { name: 'Our personal tips', src: tipsImage },
    { name: 'Best Ratings', src: ratingsImage },
    { name: 'Cheapest Prices', src: priceImage },
    { name: 'Near you', src: locationImage },
    { name: 'With Beard Trimming', src: beardImage },
    { name: 'Most Ratings', src: mostImage },
    { name: 'Our personal tips', src: tipsImage },
];

const PhotoGallery = ({  }) => {
    return (
        <ImageList sx={{ width: "100%", height: 364, borderRadius: "5px" }} cols={4} rowHeight={170} variant="quilted">
            {shopImages.map((image) => (
                <ImageListItem key={image.name}>
                    <img
                        src={`${image.src}?w=164&h=164&fit=crop&auto=format`}
                        srcSet={`${image.src}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt={image.name}
                        loading="lazy"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}

export default PhotoGallery;