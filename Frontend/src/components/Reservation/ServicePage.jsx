import React from 'react';
import { Box, Button, Stack, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const mockServices = [
    { gender: "woman", name: "Waschen, Schneiden, Föhnen", duration: "60", price: "30,00" },
    { gender: "woman", name: "Waschen, Föhnen", duration: "60", price: "10,00" },
    { gender: "woman", name: "Waschen, Glätten", duration: "60", price: "20,00" },
    { gender: "woman", name: "Haare färben", duration: "60", price: "45,00" },
    { gender: "woman", name: "Strähnen", duration: "30", price: "50,00" },
    { gender: "woman", name: "Kosmetik - Augenbrauen zupfen", duration: "10", price: "10,00" },
    { gender: "woman", name: "Kosmetik - Wimpern", duration: "10", price: "10,00" },
    { gender: "man", name: "Waschen, Schneiden und Styling", duration: "30", price: "35,00" },
    { gender: "man", name: "Maschinen-Haarschnitt", duration: "20", price: "17,50" },
    { gender: "man", name: "Färben, Schneiden und Styling", duration: "60", price: "65,00" },
    { gender: "man", name: "Bartschnitt", duration: "20", price: "10,00" },
    { gender: "man", name: "Bartschnitt und Pflege", duration: "30", price: "25,00" },
    { gender: "man", name: "Kosmetik - Augenbrauen zupfen", duration: "10", price: "10,00" },
    { gender: "kids", name: "Kinder-Haarschnitt", duration: "20", price: "12,00" }
]

const ServicePage = ({ pickedServices, pickService, removeService, name }) => {

    return (
        <Box sx={{ padding: "20px", overflow: "auto" }}>
            <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                {name || "Friseur XY Stuttgart"}
            </Typography>
            <Typography variant="overline" display="block" gutterBottom>
                Choose your services
            </Typography>
            {[...new Set(mockServices.map(obj => obj.gender))].map((gender) => (
                <Accordion sx={{ marginBottom: "20px" }} key={gender}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography sx={{ textTransform: 'capitalize' }}>{gender}</Typography>
                    </AccordionSummary>
                    {mockServices.filter((service) => service.gender === gender).map((service) => (
                        <Stack
                            key={service.name}
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
                                <Typography sx={{ lineHeight: "unset" }}>{service.price}    &#8364;</Typography>
                                {(pickedServices.some((pickedService) => pickedService === service))
                                    ?
                                    <Button type="button"
                                        sx={{ width: "105px", fontSize: "12px" }}
                                        variant="contained"
                                        onClick={() => removeService(service)}
                                    >Selected</Button>
                                    :
                                    <Button type="button"
                                        sx={{ width: "105px", fontSize: "12px" }}
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