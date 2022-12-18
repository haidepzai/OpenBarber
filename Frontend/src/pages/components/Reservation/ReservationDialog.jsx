import React from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import {Box, Button, Typography} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const steps = ['Dienstleistung', 'Termin', 'Buchung'];

const dienstlestungen = {
    damen: [
        {name: "Waschen, Schneiden, Föhnen", preis: "30,00"},
        {name: "Waschen, Föhnen", preis: "10,00"},
        {name: "Waschen, Glätten", preis: "20,00"},
        {name: "Haare färben", preis: "45,00"},
        {name: "Strähnen", preis: "50,00"},
        {name: "Kosmetik - Augenbrauen zupfen", preis: "10,00"},
        {name: "Kosmetik - Wimpern", preis: "10,00"},
    ],
    herren: [
        {name: "Waschen, Schneiden und Styling", preis: "35,00"},
        {name: "Maschinen-Haarschnitt", preis: "17,50"},
        {name: "Färben, Schneiden und Styling", preis: "65,00"},
        {name: "Bartschnitt", preis: "10,00"},
        {name: "Bartschnitt und Pflege", preis: "25,00"},
        {name: "Kosmetik - Augenbrauen zupfen", preis: "10,00"},
    ],
    kinder: [
        {name: "Kinder-Haarschnitt", preis: "12,00"}
    ]
}

function ReservationDialog({ open, handleClose }) {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            handleClose();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    }

    return (
        <Dialog
            fullWidth={true}
            maxWidth={"sm"}
            open={open}
            onClose={handleClose}
            /*sx={{ position: "relative" }}*/>
            <Box sx={{ position: "sticky", top: "0", left: "0", padding: "20px 15px", borderBottom: "1px solid rgba(0, 0, 0, 0.3)", boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)" }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <Box sx={{ padding: "20px 20px 0 20px"}}>
                <Typography variant="h6" sx={{ marginBottom: "20px"}}>
                    Friseur XY Stuttgart
                </Typography>
                {Object.keys(dienstlestungen).map((gender, i) => (
                    <Accordion sx={{ marginBottom: "20px" }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography sx={{ textTransform: 'capitalize'}}>{gender}</Typography>
                        </AccordionSummary>
                        {dienstlestungen[gender].map((dl) => (
                            <AccordionDetails sx={{ borderTop: "0.5px solid rgba(0, 0, 0, 0.3)" }}>
                                <Typography>{dl.name}</Typography>
                                <Typography>{dl.preis}</Typography>
                            </AccordionDetails>
                        ))}
                    </Accordion>
                ))}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", borderTop: "1px solid rgba(0, 0, 0, 0.3)", boxShadow: "0 -3px 10px rgba(0, 0, 0, 0.3)" }}>
                <Button variant="outlined" onClick={handleClose}>Schließen</Button>
                <Button variant="outlined" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
        </Dialog>
    );
}

export default ReservationDialog;