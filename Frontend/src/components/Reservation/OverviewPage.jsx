import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import React from 'react';
import {Box, Stack, Typography} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Overview from "./Overview";
require('dayjs/locale/de')


const OverviewPage = ({ data, setData, handleStep, showErrors, noneEmpty, error, setError }) => {

    const handleChange = (event) => {
        setData({
            ...data,
            personalData: {
                ...data.personalData,
                [event.target.name]: event.target.value
            }
        })
        if (noneEmpty) {
            setError({
                ...error,
                2: ""
            })
        }
    }

    return (
        <Box sx={{padding: "20px", overflow: "auto"}}>

            <Typography variant="h6" sx={{marginBottom: "20px"}}>
                Your Contact Details And Reminder
            </Typography>

            <Typography variant="overline" display="block" gutterBottom>
                Appointment Overview
            </Typography>

            <Overview booked={false} data={data} handleStep={handleStep} />

            <Typography variant="overline" display="block" gutterBottom>
                Your comments
            </Typography>
            <TextField
                id="outlined-multiline-static"
                multiline
                fullWidth
                rows={3}
                defaultValue=""
            />
            <Typography variant="overline" display="block" gutterBottom sx={{ margin: "20px 0 15px 0" }}>
                Contact Details
            </Typography>
            <Stack direction="column">
                <FormControl sx={{ width: "259.5px", paddingBottom: "25px" }}>
                    <InputLabel id="demo-simple-select-label">Form of Address</InputLabel>
                    <Select
                        value={data.personalData.formOfAddress}
                        label="Form of Address"
                        name="formOfAddress"
                        onChange={handleChange}
                    >
                        <MenuItem value="Mr.">Mr.</MenuItem>
                        <MenuItem value="Mrs.">Mrs.</MenuItem>
                        <MenuItem value="None">No Selection</MenuItem>
                    </Select>
                </FormControl>
                <Stack direction="row" spacing={3}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={data.personalData.firstName}
                        onChange={handleChange}
                        fullWidth
                        error={showErrors && !data.personalData.firstName}
                        helperText={showErrors && !data.personalData.firstName && "Can't be empty!"}
                        sx={{ paddingBottom: (showErrors && !data.personalData.firstName) ? "5px" : "28px" }}
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={data.personalData.lastName}
                        onChange={handleChange}
                        fullWidth
                        error={showErrors && !data.personalData.lastName}
                        helperText={showErrors && !data.personalData.lastName && "Can't be empty!"}
                        sx={{ paddingBottom: (showErrors && !data.personalData.lastName) ? "5px" : "28px" }}
                    />
                </Stack>
                <TextField
                    label="E-Mail Address"
                    name="email"
                    value={data.personalData.email}
                    onChange={handleChange}
                    fullWidth
                    error={showErrors && !data.personalData.email}
                    helperText={showErrors && !data.personalData.email && "Can't be empty!"}
                    sx={{ paddingBottom: (showErrors && !data.personalData.email) ? "5px" : "28px" }}
                />
                <TextField
                    label="Phone Number"
                    name="phone"
                    value={data.personalData.phone}
                    onChange={handleChange}
                    fullWidth
                    error={showErrors && !data.personalData.phone}
                    helperText={showErrors && !data.personalData.phone && "Can't be empty!"}
                    sx={{ paddingBottom: (showErrors && !data.personalData.phone) ? "5px" : "28px" }}
                />
            </Stack>

            <Typography variant="overline" display="block" gutterBottom sx={{ marginTop: "20px" }}>
                Payment Method
            </Typography>
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="female" control={<Radio />} label="On Site (Cash or Card)" />
                    <FormControlLabel value="male" control={<Radio />} label="Paypal" />
                    <FormControlLabel value="other" control={<Radio />} label="Bank Transfer" />
                </RadioGroup>
            </FormControl>
        </Box>
    );
}

export default OverviewPage;