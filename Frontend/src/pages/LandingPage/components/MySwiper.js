import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "../../../css/components/Swiper.css"
// import required modules
import { Pagination } from "swiper";

import beardImage from "../assets/beard.jpg"
import ratingsImage from "../assets/rating.jpg"
import mostImage from "../assets/most.jpg"
import priceImage from "../assets/price.jpg"
import locationImage from "../assets/location.jpg"
import tipsImage from "../assets/tips.jpg"
import {Typography, Box} from "@mui/material";

function MySwiper(props) {

    const criteria = [
        {name: "Best Ratings", src: ratingsImage},
        {name:"Cheapest Prices", src: priceImage},
        {name: "Near you", src: locationImage},
        {name: "With Beard Trimming", src: beardImage},
        {name: "Most Ratings", src: mostImage},
        {name: "Our personal tips", src: tipsImage}]

    return (
        <Swiper
            slidesPerView={4}
            spaceBetween={0}
            pagination={{
                clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
            style={{ zIndex: "0", paddingBottom: "30px" }}
        >
            {criteria.map(({ name, src}) => (
                <SwiperSlide>
                    <Box sx={{
                        padding: "0",
                        margin: "15px",
                        position: "relative",
                        height: "400px",
                        width: "400px",
                        borderRadius: "10px",
                        boxShadow: "rgba(0, 0, 0, 0.6) 0px 2px 8px"}}>
                        <img src={src} style={{ objectFit: "cover", filter: "brightness(0.7) contrast(1.2)", borderRadius: "10px"}} />
                        <Typography variant="h3" sx={{ textAlign: "center", position: "absolute", top: "50%",left: "50%", transform: "translate(-50%, -50%)", margin: "0", color: "white.main" }}>
                            {name}
                        </Typography>
                    </Box>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default MySwiper;