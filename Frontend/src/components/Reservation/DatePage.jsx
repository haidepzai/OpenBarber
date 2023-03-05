import React from 'react';
import { Box, IconButton, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import Stylist from "./Stylist";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import TextField from "@mui/material/TextField";
import { useState } from "react";


const mockStylists = [
    { name: "Any" },
    { name: "Alexandra", titel: "Junior Stylist", image: "https://as2.ftcdn.net/v2/jpg/02/48/30/91/1000_F_248309112_rOMWh2P9z4lI5tgDXrB8cAVKCzlNRO88.jpg" },
    { name: "Peter", titel: "Junior Stylist", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdVWjI1XVRB5hg9hZ24rMkPtmLCb9jU_NoBQ&usqp=CAU" },
    { name: "Laura", titel: "Senior Stylist", image: "https://as2.ftcdn.net/v2/jpg/02/48/30/91/1000_F_248309112_rOMWh2P9z4lI5tgDXrB8cAVKCzlNRO88.jpg" },
    { name: "Paul", titel: "Senior Stylist", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdVWjI1XVRB5hg9hZ24rMkPtmLCb9jU_NoBQ&usqp=CAU" },
]

const DatePage = ({ pickedStylist, pickStylist, pickedDate, pickDate }) => {

    const [expanded, setExpanded] = useState(false);

    const handlePick = (stylist) => {
        pickStylist(stylist);
        setExpanded(false)
    }

    return (
        <Box sx={{ padding: "20px", overflowY: "auto" }}>
            <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                Choose your Stylist & Appointment
            </Typography>
            <Typography variant="overline" display="block" gutterBottom>
                Choose your Stylist
            </Typography>
            <Accordion sx={{ marginBottom: "20px" }} expanded={expanded}>
                <Box sx={{ position: "relative" }} onClick={() => setExpanded(!expanded)}>
                    <Stylist stylist={pickedStylist} onClick={setExpanded} selected />
                    <Box sx={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)" }}>
                        {expanded ?
                            <IconButton type="button" aria-label="delete">
                                <ExpandLessIcon />
                            </IconButton>
                            :
                            <IconButton type="button" aria-label="delete">
                                <ExpandMoreIcon />
                            </IconButton>
                        }
                    </Box>
                </Box>
                {mockStylists.filter((stylist) => stylist.name !== pickedStylist.name).map((stylist) => (
                    <Stylist key={stylist.name} stylist={stylist} onClick={() => handlePick(stylist)} />
                ))}
            </Accordion>
            <Typography variant="overline" display="block" gutterBottom>
                Choose your date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    openTo="day"
                    value={pickedDate}
                    onChange={(newValue) => {
                        pickDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            {pickedDate &&
                <Box sx={{ width: "100%", border: "1px solid rgb(236,236,236)", padding: "10px 20px", boxSizing: "border-box" }}>
                    <Typography sx={{ fontSize: "14px" }}>Appointments for {pickedDate.format("DD/MM/YYYY")}</Typography>
                </Box>
            }
        </Box>
    );
}

export default DatePage;