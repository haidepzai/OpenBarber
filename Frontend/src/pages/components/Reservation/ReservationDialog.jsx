import React, {useEffect, useState} from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import {Box, Button, IconButton, Stack, Typography} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import ServicePage from "./ServicePage";
import Stylist from "./Stylist";
import DatePage from "./DatePage";
import OverviewPage from "./OverviewPage";
import SuccessScreen from "./SuccessScreen";

/* TODO: Geldsumme, Schließen X bei Sucess Screen, Duration zu Service hinzufügen */

const steps = ['Dienstleistung', 'Termin', 'Buchung'];

function ReservationDialog({ open, handleClose }) {
    const [activeStep, setActiveStep] = useState(0);

    const [data, setData] = useState({
        services: [],
        stylist: {name: "Beliebig"},
        date: "",
        personalData: {
            formOfAddress: "None",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
        note: ""
    })
    /* Choose a service! Pick a date! Check your information! */
    const [error, setError] = useState({
        0: "",
        1: "",
        2: ""
    });

    const validate = (step) => {
        switch(step) {
            case 0:
                return data.services.length > 0
            case 1:
                return !!data.date
            case 2:
                return !Object.values(data.personalData).map(Boolean).includes(false)
            default:
                console.log("rip")
        }
    }

    const handleNext = () => {
        if (activeStep === 0 && !validate(0)) {
            setError({
                ...error,
                0: "Choose a service!"
            })
        } else if (activeStep === 1 && !validate(1)) {
            setError({
                ...error,
                1: "Pick a date!"
            })
        } else if (activeStep === 2 && !validate(2)) {
            setError({
                ...error,
                2: "Check your information!"
            })
        } else {
            if (activeStep === 2) {
                handleSubmit();
            } else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }
    }

    const [showSuccessScreen,setShowSuccessScreen] = useState(false);

    const handleSubmit = () => {
        setShowSuccessScreen(true);
        console.log("Successfully booked your appointment!", data)
    }

    const handleStep = (step) => {
        setActiveStep(step)
    }

    const pickService = (newService) => {
        setData({
            ...data,
            services: [
                ...data.services,
                newService
            ]
        })
        if (error[0]) {
            setError({
                ...error,
                0: ""
            })
        }
    }
    const removeService = (oldService) => {
        const updatedServices = data.services.filter((service) => service !== oldService);
        setData({
            ...data,
            services: [
                ...updatedServices
            ]
        })
    }

    const pickStylist = (stylist) => {
        setData({
            ...data,
            stylist: stylist
        })
    }

    const pickDate = (date) => {
        setData({
            ...data,
            date: date
        })
        if (error[1]) {
            setError({
                ...error,
                1: ""
            })
        }
    }

    const prevNotDone = (index) => {
        if (index === 1) {
            return !validate(0)
        } else if (index === 2) {
            return !validate(0) || !validate(1)
        } else {
            return false
        }
    }


    return (
        <Dialog
            fullWidth={true}
            maxWidth={"sm"}
            open={open}
            onClose={handleClose}>
                {showSuccessScreen
                    ?
                    <SuccessScreen data={data} />
                    :
                    <Box sx={{ height: "80vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                        <Box sx={{ padding: "20px 15px", borderBottom: "1px solid rgba(0, 0, 0, 0.3)", boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)", zIndex: "1", backgroundColor: "white" }}>
                            <Stepper nonLinear activeStep={activeStep}>
                                {steps.map((label, index) => (
                                    <Step key={label} completed={validate(index)}>
                                        <StepButton type="button" onClick={() => handleStep(index)} sx={{ '& .MuiSvgIcon-root': { color: prevNotDone(index) ? "rgba(0, 0, 0, 0.1)" : "default" }}} disabled={prevNotDone(index)}>
                                            {label}
                                        </StepButton>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        {activeStep === 0 &&
                            <ServicePage pickedServices={data.services} pickService={pickService} removeService={removeService} />
                        }

                        {activeStep === 1 &&
                            <DatePage pickedStylist={data.stylist} pickStylist={pickStylist} pickedDate={data.date} pickDate={pickDate}  />
                        }

                        {activeStep === 2 &&
                            <OverviewPage data={data} setData={setData} handleStep={handleStep} showErrors={!!error[2]} noneEmpty={validate(2)} error={error} setError={setError}/>
                        }

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", borderTop: "1px solid rgba(0, 0, 0, 0.3)", boxShadow: "0 -3px 10px rgba(0, 0, 0, 0.3)", zIndex: "1" }}>
                            <Button variant="outlined" type="button" onClick={handleClose}>Close</Button>
                            {error[activeStep] &&
                                <Typography variant="body1" sx={{backgroundColor: "rgba(255,0,0,.9)", borderRadius: "40px", fontSize: "14px", color: "white", padding: "5px 20px" }}>
                                    {error[activeStep]}
                                </Typography>
                            }
                            <Button variant="outlined" type="button" onClick={handleNext}>
                                {activeStep === 2 ? "Book Now" : "Next"}
                            </Button>
                        </Box>
                    </Box>
                }
        </Dialog>
    );
}

export default ReservationDialog;