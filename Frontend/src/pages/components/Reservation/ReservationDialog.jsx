import React, {useState} from 'react';
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



const steps = ['Dienstleistung', 'Termin', 'Buchung'];

const dienstleistungen = {
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

const stylists = [
/*
    {name: "Beliebig", titel: "", image: "https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png"},
*/
    {name: "Alexandra", titel: "Junior Stylistin", image: "https://as2.ftcdn.net/v2/jpg/02/48/30/91/1000_F_248309112_rOMWh2P9z4lI5tgDXrB8cAVKCzlNRO88.jpg"},
    {name: "Peter", titel: "Senior Stylist", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdVWjI1XVRB5hg9hZ24rMkPtmLCb9jU_NoBQ&usqp=CAU"},
    {name: "Alexandra", titel: "Junior Stylistin", image: "https://as2.ftcdn.net/v2/jpg/02/48/30/91/1000_F_248309112_rOMWh2P9z4lI5tgDXrB8cAVKCzlNRO88.jpg"},
    {name: "Peter", titel: "Senior Stylist", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdVWjI1XVRB5hg9hZ24rMkPtmLCb9jU_NoBQ&usqp=CAU"},
]

function ReservationDialog({ open, handleClose }) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [pickedCut, setPickedCut] = useState(false);
    const [pickedStylist, setPickedStylist] = React.useState('');
    const [expanded, setExpanded] = useState(false);
    const [dateValue, setDateValue] = useState(dayjs());


    const handleChange = (event) => {
        setPickedStylist(event.target.value);
    };

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
            onClose={handleClose}>
            <Box sx={{ height: "80vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box sx={{ position: "sticky", top: "0", left: "0", padding: "20px 15px", borderBottom: "1px solid rgba(0, 0, 0, 0.3)", boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)", zIndex: "1" }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                {activeStep === 0 &&
                    <Box sx={{padding: "20px", overflow: "auto"}}>
                        <Typography variant="h6" sx={{marginBottom: "20px"}}>
                            Friseur XY Stuttgart
                        </Typography>
                        <Typography variant="overline" display="block" gutterBottom>
                            Dienstleistung auswählen
                        </Typography>
                        {Object.keys(dienstleistungen).map((gender, i) => (
                            <Accordion sx={{marginBottom: "20px"}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{textTransform: 'capitalize'}}>{gender}</Typography>
                                </AccordionSummary>
                                {dienstleistungen[gender].map((dl) => (
                                    <Box sx={{
                                        borderTop: "0.5px solid rgb(236,236,236)",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "16px"
                                    }}>
                                        <Box>
                                            <Typography variant="overline" sx={{
                                                textTransform: 'uppercase',
                                                lineHeight: "unset",
                                                color: "#666"
                                            }}>{gender}</Typography>
                                            <Typography>{dl.name}</Typography>
                                        </Box>
                                        <Box sx={{display: "flex", alignItems: "center", gap: "15px"}}>
                                            <Typography sx={{lineHeight: "unset"}}>{dl.preis}    &#8364;</Typography>
                                            {(dl.name === "Waschen, Schneiden, Föhnen")
                                                ?
                                                <Button sx={{width: "105px", fontSize: "12px"}}
                                                        variant={pickedCut ? "contained" : "outlined"}
                                                        onClick={() => setPickedCut(!pickedCut)}>{pickedCut ? "Ausgewählt" : "Auswählen"}</Button>
                                                :
                                                <Button sx={{width: "105px", fontSize: "12px"}}
                                                        variant="outlined">Auswählen</Button>
                                            }
                                        </Box>
                                    </Box>
                                ))}
                            </Accordion>
                        ))}
                    </Box>
                }
                {activeStep === 1 &&
                    <Box sx={{padding: "20px", overflowY: "auto" }}>
                        <Typography variant="h6" sx={{marginBottom: "20px"}}>
                            Stylisten & Wunschtermin auswählen
                        </Typography>
                        <Typography variant="overline" display="block" gutterBottom>
                            Stylist auswählen
                        </Typography>
                        <Accordion sx={{marginBottom: "20px"}} expanded={expanded}>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "20px",
                                padding: "5.5px 15px"
                            }}>
                                <Stack direction="row" alignItems="center" gap="15px">
                                    <AccountCircleIcon sx={{ height: "60px", width: "60px" }} />
                                    <Box>
                                        <Typography sx={{ lineHeight: "unset" }}>Beliebig</Typography>
                                        <Typography variant="overline" sx={{
                                            textTransform: 'uppercase',
                                            lineHeight: "unset",
                                            color: "#666"
                                        }}></Typography>
                                    </Box>
                                </Stack>
                                {expanded ?
                                    <IconButton aria-label="delete" onClick={() => setExpanded(false)}>
                                        <ExpandLessIcon/>
                                    </IconButton>
                                    :
                                    <IconButton aria-label="delete" onClick={() => setExpanded(true)}>
                                        <ExpandMoreIcon/>
                                    </IconButton>
                                }
                            </Box>
                            {stylists.map((stylist) => (
                                <Box sx={{
                                    borderTop: "0.5px solid rgb(236,236,236)",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    padding: "10px 20px",
                                    gap: "20px",
                                    cursor: "pointer",
                                }}
                                onClick={() => setExpanded(false)}>
                                    <Avatar
                                        alt={stylist.name}
                                        src={stylist.image}
                                        sx={{ width: 50, height: 50 }}
                                    />
                                    <Box>
                                        <Typography sx={{ lineHeight: "unset" }}>{stylist.name}</Typography>
                                        <Typography variant="overline" sx={{
                                            textTransform: 'uppercase',
                                            lineHeight: "unset",
                                            color: "#666"
                                        }}>{stylist.titel}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Accordion>
                        <Typography variant="overline" display="block" gutterBottom>
                            Termin auswählen
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StaticDatePicker
                                displayStaticWrapperAs="desktop"
                                openTo="day"
                                value={dateValue}
                                onChange={(newValue) => {
                                    setDateValue(newValue);
                                }}
                                renderInput={(params) => <TextField {...params}/>}
                            />
                        </LocalizationProvider>
                        <Box sx={{ width: "100%", border: "1px solid rgb(236,236,236)", padding: "10px 20px", boxSizing: "border-box" }}>
                            <Typography sx={{ fontSize: "14px"}}>Termine für Do, 29. Dez. 2022</Typography>
                        </Box>

                    </Box>
                }
                {activeStep === 2 &&
                    <Box sx={{padding: "20px", overflow: "auto"}}>
                        <Typography variant="h6" sx={{marginBottom: "20px"}}>
                            Ihre Kontaktdaten und Termin-Erinnerung
                        </Typography>
                        <Typography variant="overline" display="block" gutterBottom>
                            Terminübersicht
                        </Typography>
                        <Box sx={{ borderRadius: "8px", border: "1px solid rgb(236,236,236)", marginBottom: "20px" }}>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ borderTop: "1px solid rgb(236,236,236)", padding: "16px" }}>
                                <CalendarMonthIcon fontSize="large" />
                                <Typography sx={{ lineHeight: "unset" }}>Donnerstag, 29.12.2022 um 10:45 Uhr</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ borderTop: "1px solid rgb(236,236,236)", padding: "16px" }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <ContentCutIcon fontSize="large" />
                                    <Typography sx={{ lineHeight: "unset" }}>Waschen, Schneiden, Föhnen</Typography>
                                </Stack>
                                <Typography sx={{lineHeight: "unset"}}>30,00 &#8364;</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ borderTop: "1px solid rgb(236,236,236)", padding: "11px 16px" }}>
                                <Avatar
                                    alt="Alexandra"
                                    src={stylists[0].image}
                                    sx={{ width: 35, height: 35 }}
                                />
                                <Box>
                                    <Typography sx={{ lineHeight: "unset" }}>{stylists[0].name}</Typography>
                                    <Typography variant="overline" sx={{
                                        textTransform: 'uppercase',
                                        lineHeight: "unset",
                                        color: "#666"
                                    }}>{stylists[0].titel}</Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ borderTop: "1px solid rgb(236,236,236)", padding: "16px"  }}>
                                <HourglassBottomIcon fontSize="large" />
                                <Typography sx={{ lineHeight: "unset" }}>Dauer: 1 Stunde (endet um 11:45 Uhr)</Typography>
                            </Stack>
                        </Box>
                        <Typography variant="overline" display="block" gutterBottom>
                            Ihre Anmerkungen
                        </Typography>
                        <TextField
                            id="outlined-multiline-static"
                            multiline
                            fullWidth
                            rows={3}
                            defaultValue=""
                            sx={{ marginBottom: "20px" }}
                        />
                        <Typography variant="overline" display="block" gutterBottom>
                            Kontaktdaten
                        </Typography>
                        <Typography variant="overline" display="block" gutterBottom>
                            Bezahlungsmethode
                        </Typography>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="female" control={<Radio />} label="Vor Ort" />
                                <FormControlLabel value="male" control={<Radio />} label="Paypal" />
                                <FormControlLabel value="other" control={<Radio />} label="Überweisung" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                }
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", borderTop: "1px solid rgba(0, 0, 0, 0.3)", boxShadow: "0 -3px 10px rgba(0, 0, 0, 0.3)", zIndex: "1" }}>
                    <Button variant="outlined" onClick={handleClose}>Schließen</Button>
                    <Button variant="outlined" onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}

export default ReservationDialog;