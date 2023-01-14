import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../css/components/Swiper.css";
// import required modules
import swiper, {Navigation, Pagination} from "swiper";

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
        <div style={{ position: "relative" }}>
            <Swiper
                slidesPerView={5}
                spaceBetween={20}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                {criteria.map(({ name, src}) => (
                    <SwiperSlide>
                        <Box sx={{
                                padding: "0",
                                position: "relative",
                                height: "300px",
                                width: "300px",
                                borderRadius: "10px",
                                boxShadow: "rgba(0, 0, 0, 0.6) 0px 2px 8px",
                                transition: "0.15s ease-in-out",
                                "& img": {
                                    objectFit: "cover", filter: "brightness(0.75) contrast(1.2)", borderRadius: "10px", transition: "0.15s ease-in-out",
                                },
                                "&:hover": {
                                    cursor: "pointer",
                                    "& img": {
                                        filter: "brightness(0.55) contrast(1.2)",
                                    },
                                    "& h4": {
                                        textShadow: "3px 3px 0px #6D5344"
                                    }
                                },
                            }}
                        >
                            <img src={src} />
                            <Typography variant="h4" sx={{ textAlign: "center", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", margin: "0", color: "white.main", transition: "0.15s ease-in-out"}}>
                                {name}
                            </Typography>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default MySwiper;