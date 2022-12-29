import React from 'react';
import {Box, Button, Stack, Typography} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const mockServices = {
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

const ServicePage = ({ pickedServices, onPick, removePick }) => {

    return (
        <Box sx={{padding: "20px", overflow: "auto"}}>
            <Typography variant="h6" sx={{marginBottom: "20px"}}>
                Friseur XY Stuttgart
            </Typography>
            <Typography variant="overline" display="block" gutterBottom>
                Dienstleistung auswählen
            </Typography>
            {Object.keys(mockServices).map((gender, i) => (
                <Accordion sx={{marginBottom: "20px"}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography sx={{textTransform: 'capitalize'}}>{gender}</Typography>
                    </AccordionSummary>
                    {mockServices[gender].map((dl) => (
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                                borderTop: "0.5px solid rgb(236,236,236)",
                                padding: "16px"
                            }}
                        >
                            <Box>
                                <Typography variant="overline" sx={{
                                    textTransform: 'uppercase',
                                    lineHeight: "unset",
                                    color: "#666"
                                }}>{gender}</Typography>
                                <Typography>{dl.name}</Typography>
                            </Box>
                            <Stack direction="row" alignItems="center" gap="15px">
                                <Typography sx={{lineHeight: "unset"}}>{dl.preis}    &#8364;</Typography>
                                {
                                    /*(dl.name === "Waschen, Schneiden, Föhnen")*/
                                    (pickedServices.some((pickedService) => pickedService === dl))
                                    ?
                                    <Button sx={{width: "105px", fontSize: "12px"}}
                                            variant="contained"
                                            onClick={() => removePick(dl)}>Ausgewählt</Button>
                                    :
                                    <Button sx={{width: "105px", fontSize: "12px"}}
                                            variant="outlined"
                                            onClick={() => onPick(dl)}
                                    >Auswählen</Button>
                                }
                            </Stack>
                        </Stack>
                    ))}
                </Accordion>
            ))}
        </Box>
    );
}

export default ServicePage;