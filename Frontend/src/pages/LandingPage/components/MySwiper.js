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
        {name: "Most Ratings", src: mostImage},
        {name:"Cheapest Prices", src: priceImage},
        {name: "Near you", src: locationImage},
        {name: "Our personal tips", src: tipsImage},
        {name: "With Beard Trimming", src: beardImage}]

    return (
        <Swiper
            slidesPerView={4}
            spaceBetween={0}
            pagination={{
                clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
            style={{ zIndex: "0" }}
        >
            {criteria.map(({ name, src}) => (
                <SwiperSlide style={{}}>
                    <Box sx={{
                        padding: "0",
                        margin: "15px",
                        height: "400px",
                        width: "400px",
                        background: `url(${src})`,
                        backgroundSize: "cover",
                        backdropFilter: "blur(5px)",
                        position: "relative",
                        borderRadius: "10px",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"}}>
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