import React, { useReducer, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { Box, Button, Typography } from "@mui/material";
import ServicePage from "./ServicePage";
import DatePage from "./DatePage";
import OverviewPage from "./OverviewPage";
import SuccessScreen from "./SuccessScreen";

const steps = ['Services', 'Date', 'Booking'];

const initialState = {
    services: [],
    stylist: { name: "Any" },
    date: "",
    personalData: {
        formOfAddress: "None",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    },
    note: ""
};

const initialErrorState = {
    0: "",
    1: "",
    2: ""
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'set_services':
            return { ...state, services: [...state.services, action.payload] };
        case 'remove_service':
            return { ...state, services: state.services.filter((service) => service !== action.payload) };
        case 'set_stylist':
            return { ...state, stylist: action.payload };
        case 'set_date':
            return { ...state, date: action.payload };
        case 'set_personal_data':
            return { ...state, personalData: { ...state.personalData, ...action.payload } };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

function ReservationDialog({ open, handleClose, shop }) {
    const [data, dispatch] = useReducer(reducer, initialState);
    const [error, setError] = useState(initialErrorState);
    const [activeStep, setActiveStep] = useState(0);
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);

    const validate = (step) => {
        switch (step) {
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

    const handleSubmit = () => {
        setShowSuccessScreen(true);
        console.log("Successfully booked your appointment!", data)
    }

    const handleStep = (step) => {
        setActiveStep(step)
    }

    const pickService = (newService) => {
        dispatch({ type: 'set_services', payload: newService });
        if (error[0]) {
            setError({
                ...error,
                0: ""
            })
        }
    }

    const removeService = (oldService) => {
        dispatch({ type: 'remove_service', payload: oldService });
    }

    const pickStylist = (stylist) => {
        dispatch({ type: 'set_stylist', payload: stylist });
    }

    const pickDate = (date) => {
        dispatch({ type: 'set_date', payload: date });
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
                <SuccessScreen data={data} onClose={handleClose} />
                :
                <Box sx={{ height: "80vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                    <Box sx={{ padding: "20px 15px", borderBottom: "1px solid rgba(0, 0, 0, 0.3)", boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)", zIndex: "1", backgroundColor: "white" }}>
                        <Stepper nonLinear activeStep={activeStep}>
                            {steps.map((label, index) => (
                                <Step key={label} completed={validate(index)}>
                                    <StepButton type="button" onClick={() => handleStep(index)} sx={{ '& .MuiSvgIcon-root': { color: prevNotDone(index) ? "rgba(0, 0, 0, 0.1)" : "default" } }} disabled={prevNotDone(index)}>
                                        {label}
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    {activeStep === 0 &&
                        <ServicePage pickedServices={data.services} pickService={pickService} removeService={removeService} name={shop.name} />
                    }

                    {activeStep === 1 &&
                        <DatePage pickedStylist={data.stylist} pickStylist={pickStylist} pickedDate={data.date} pickDate={pickDate} />
                    }

                    {activeStep === 2 &&
                        <OverviewPage data={data} setData={dispatch} handleStep={handleStep} showErrors={!!error[2]} noneEmpty={validate(2)} error={error} setError={setError} />
                    }

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", borderTop: "1px solid rgba(0, 0, 0, 0.3)", boxShadow: "0 -3px 10px rgba(0, 0, 0, 0.3)", zIndex: "1" }}>
                        <Button variant="outlined" type="button" onClick={handleClose}>Close</Button>
                        {error[activeStep] &&
                            <Typography variant="body1" sx={{ backgroundColor: "error.dark", borderRadius: "40px", fontSize: "14px", color: "white.main", padding: "5px 20px" }}>
                                {error[activeStep]}
                            </Typography>
                        }
                        <Button variant={error[activeStep] ? "outlined" : "contained"} type="button" onClick={handleNext}>
                            {activeStep === 2 ? "Book Now" : "Next"}
                        </Button>
                    </Box>

                </Box>
            }
        </Dialog>
    );
}

export default ReservationDialog;