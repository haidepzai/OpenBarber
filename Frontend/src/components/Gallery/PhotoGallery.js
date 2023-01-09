import React, {useState} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import beardImage from '../../assets/beard.jpg';
import ratingsImage from '../../assets/rating.jpg';
import mostImage from '../../assets/most.jpg';
import priceImage from '../../assets/price.jpg';
import locationImage from '../../assets/location.jpg';
import tipsImage from '../../assets/tips.jpg';
import { Typography, Box } from '@mui/material';
import PhotoSwiper from "./PhotoSwiper";

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

    const [openPhotoswiper, setOpenPhotoswiper] = useState(false)

    return (
        <Box>
            <Typography variant="h6" sx={{ paddingLeft: "10px" }}>{shopImages.length} Photos</Typography>
            <ImageList sx={{ width: "100%", height: "344px", borderRadius: "5px", boxShadow: 4 }} cols={4} rowHeight={170} variant="quilted">
                {shopImages.map((image) => (
                    <ImageListItem key={image.name} onClick={() => setOpenPhotoswiper(true)} sx={{ '&:hover': { cursor: "pointer"} }}>
                        <img
                            src={`${image.src}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${image.src}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={image.name}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            {openPhotoswiper && (
                <PhotoSwiper images={shopImages} onClose={() => setOpenPhotoswiper(false)}/>
            )}
        </Box>
    );
}

export default PhotoGallery;