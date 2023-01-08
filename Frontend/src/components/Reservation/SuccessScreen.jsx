import React from 'react';
import {Box, Divider, IconButton, Stack, Typography} from "@mui/material";
import Overview from "./Overview";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const SuccessScreen = ({ data, onClose }) => {
    return (
        <Box sx={{ padding: "30px 40px 10px 40px", position: "relative" }}>
            <IconButton sx={{ position: "absolute", right: "10px", top: "10px" }} onClick={onClose}>
                <CloseIcon sx={{ fontSize: "30px" }}/>
            </IconButton>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                <CheckIcon color="success" sx={{ fontSize: 40 }} />
                <Typography variant="h6" sx={{marginBottom: "20px"}}>
                    Your booking was successfull!
                </Typography>
                <CheckIcon color="success" sx={{ fontSize: 40 }} />
            </Stack>
            <Divider sx={{margin: "20px 0 10px 0"}}/>
            <Typography variant="body1">
                Your Name: <b>{data.personalData.firstName + " " + data.personalData.lastName}</b>
            </Typography>
            <Divider sx={{margin: "10px 0"}}/>
            <Typography variant="body1">
                Confirmation E-Mail will be sent to: <b>{data.personalData.email}</b>
            </Typography>
            <Divider sx={{margin: "10px 0"}}/>
            <Typography variant="overline" display="block" gutterBottom>
                Booking Details
            </Typography>
            <Overview booked data={data} />
        </Box>
    );
}

export default SuccessScreen;