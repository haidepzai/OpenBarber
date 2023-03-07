import React from 'react';
import {Box, IconButton, Stack, Typography} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import {ArrowForwardIos} from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

const Overview = ({ booked, data, handleStep }) => {

    const totalDuration = () => {
        return data.services.map((service) => parseInt(service.duration)).reduce((prev, next) => prev + next);
    }

    const totalPrice = () => {
        return data.services.map((service) => parseInt(service.price)).reduce((prev, next) => prev + next);
    }

    return (
        <Box sx={{ borderRadius: "8px", border: "1px solid rgb(236,236,236)", marginBottom: "20px" }}>
            <Stack direction="row" alignItems="center" spacing={3} sx={{ borderTop: "1px solid rgb(236,236,236)", padding: " 16px 24px" }}>
                <CalendarMonthIcon fontSize="large" />
                <Typography sx={{ lineHeight: "unset" }}>{data.date.locale('en').format('dddd[, ] DD.MM.YYYY[ at ]hh:mm[ o\' clock]')}</Typography>
            </Stack>
            <Stack direction="row" alignItems={data.services.length > 1 ? "start" : "center"} sx={{ borderTop: "1px solid rgb(236,236,236)", padding: "16px 16px 16px 24px", '&:hover': { backgroundColor: !booked && "rgba(0, 0, 0, 0.1)", cursor: !booked && "pointer"} }} onClick={() => handleStep(0)}>
                <ContentCutIcon fontSize="large" />
                <Stack direction="column" gap={1} sx={{ width: "100%", padding: "0 16px 0 24px"}}>
                    {data.services.map((service, index) => (
                        <Stack key={service.name} direction="row" justifyContent="space-between" sx={{ width: "100%"}}>
                            <Typography sx={{ lineHeight: "unset", textTransform: "capitalize", fontSize: data.services.length > 1 ? "14px" : "16px" }}>{(index !== 0 ? " + " : "") + service.targetAudience + " > " + service.name}</Typography>
                            <Typography sx={{lineHeight: "unset", fontSize: data.services.length > 1 ? "14px" : "16px" }}>{service.price} &#8364;</Typography>
                        </Stack>
                    ))}
                    {(data.services.length >= 2) &&
                        <Typography sx={{lineHeight: "unset", fontSize: data.services.length > 1 ? "14px" : "16px", alignSelf: "end", borderTop: "1px solid black", padding: "5px 5px 0 10px" }}>{totalPrice()} &#8364;</Typography>
                    }
                </Stack>
                {!booked &&
                    <IconButton sx={{ alignSelf: "center" }}>
                        <ArrowForwardIos />
                    </IconButton>
                }
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ borderTop: "1px solid rgb(236,236,236)", padding: "13.5px 16px 13.5px 24px", '&:hover': { backgroundColor: !booked && "rgba(0, 0, 0, 0.1)", cursor: !booked && "pointer"} }} onClick={() => handleStep(1)}>
                <Stack direction="row" alignItems="center" spacing={3}>
                    <Avatar
                        alt="Alexandra"
                        src={data.stylist.picture}
                        sx={{ width: 35, height: 35 }}
                    />
                    <Box>
                        <Typography sx={{ lineHeight: "unset" }}>{data.stylist.name}</Typography>
                        <Typography variant="overline" sx={{
                            textTransform: 'uppercase',
                            lineHeight: "unset",
                            color: "#666"
                        }}>{data.stylist.titel}</Typography>
                    </Box>
                </Stack>
                {!booked &&
                    <IconButton sx={{alignSelf: "center"}}>
                        <ArrowForwardIos/>
                    </IconButton>
                }
            </Stack>
            <Stack direction="row" alignItems="center" spacing={3} sx={{ borderTop: "1px solid rgb(236,236,236)", padding: "16px 24px"  }}>
                <HourglassBottomIcon fontSize="large" />
                <Typography sx={{ lineHeight: "unset" }}>Duration: {totalDuration()} Minutes (ends approx. at {data.date.add(totalDuration(), 'minutes').format('hh:mm[ o\' clock]')})</Typography>
            </Stack>
        </Box>
    );
}

export default Overview;