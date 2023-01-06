import React, {useEffect} from 'react';
import {Box, Button, Stack, Typography} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const mockServices = [
    {gender: "woman", name: "Waschen, Schneiden, Föhnen", duration: "60", preis: "30,00"},
    {gender: "woman", name: "Waschen, Föhnen", duration: "60", preis: "10,00"},
    {gender: "woman", name: "Waschen, Glätten", preis: "20,00"},
    {gender: "woman", name: "Haare färben", preis: "45,00"},
    {gender: "woman", name: "Strähnen", preis: "50,00"},
    {gender: "woman", name: "Kosmetik - Augenbrauen zupfen", preis: "10,00"},
    {gender: "woman", name: "Kosmetik - Wimpern", preis: "10,00"},
    {gender: "man", name: "Waschen, Schneiden und Styling", preis: "35,00"},
    {gender: "man", name: "Maschinen-Haarschnitt", preis: "17,50"},
    {gender: "man", name: "Färben, Schneiden und Styling", preis: "65,00"},
    {gender: "man", name: "Bartschnitt", preis: "10,00"},
    {gender: "man", name: "Bartschnitt und Pflege", preis: "25,00"},
    {gender: "man", name: "Kosmetik - Augenbrauen zupfen", preis: "10,00"},
    {gender: "kids", name: "Kinder-Haarschnitt", preis: "12,00"}
]

const ServicePage = ({ pickedServices, pickService, removeService }) => {

    return (
        <Box sx={{padding: "20px", overflow: "auto"}}>
            <Typography variant="h6" sx={{marginBottom: "20px"}}>
                Friseur XY Stuttgart
            </Typography>
            <Typography variant="overline" display="block" gutterBottom>
                Choose your services
            </Typography>
            {[...new Set(mockServices.map(obj => obj.gender))].map((gender) => (
                <Accordion sx={{marginBottom: "20px"}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography sx={{textTransform: 'capitalize'}}>{gender}</Typography>
                    </AccordionSummary>
                    {mockServices.filter((service) => service.gender === gender).map((service) => (
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
                                }}>{service.gender}</Typography>
                                <Typography>{service.name}</Typography>
                            </Box>
                            <Stack direction="row" alignItems="center" gap="15px">
                                <Typography sx={{lineHeight: "unset"}}>{service.preis}    &#8364;</Typography>
                                {(pickedServices.some((pickedService) => pickedService === service))
                                    ?
                                    <Button type="button"
                                            sx={{width: "105px", fontSize: "12px"}}
                                            variant="contained"
                                            onClick={() => removeService(service)}
                                    >Selected</Button>
                                    :
                                    <Button type="button"
                                            sx={{width: "105px", fontSize: "12px"}}
                                            variant="outlined"
                                            onClick={() => pickService(service)}
                                    >Select</Button>
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