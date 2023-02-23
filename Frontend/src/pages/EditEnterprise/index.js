import React, {useEffect, useState} from 'react';
import {
    Box,
    Checkbox,
    Divider,
    FormGroup,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import Paper from "@mui/material/Paper";
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import FormLabel from "@mui/material/FormLabel";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import FormControl from "@mui/material/FormControl";
import PaymentIcon from "@mui/icons-material/Payment";
import FormControlLabel from "@mui/material/FormControlLabel";
import ServiceTable from "../../components/EditEnterprise/Service/ServiceTable.tsx";
import EmployeeTable from "../../components/EditEnterprise/Employee/EmployeeTable.tsx";

const loggedInEnterpriseId = 62;
const loggedInUserId = 63;
const img = "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
const paymentMethodOptions = ["ON_SITE_CASH", "ON_SITE_CARD", "BANK_TRANSFER", "PAYPAL"]
const drinkOptions = ["COFFEE", "TEA", "WATER", "SOFT_DRINKS", "BEER", "CHAMPAGNE", "SPARKLING_WINE"]

const EditEnterprisePage = () => {

    const [loading, setLoading] = useState(true);
    const [enterprise, setEnterprise] = useState({});
    const [user, setUser] = useState({})

    const handleEnterpriseChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setEnterprise({
            ...enterprise,
            [name]: value
        });
    }

    const handleEnterpriseArrayChange = (event, value) => {
        const name = event.target.name;
        const checked = event.target.checked;
        if (checked) {
            setEnterprise({
                ...enterprise,
                [name]: [
                    ...enterprise[name],
                    value
                ]
            })
        } else {
            setEnterprise({
                ...enterprise,
                [name]: enterprise[name].filter((pm) => pm !== value)
            })
        }
    }

    const handleUserChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setUser({
            ...user,
            [name]: value
        });
    }

    useEffect(() => {
        const loadData = async () => {
            const enterpriseResponse = await fetch(`http://localhost:3001/enterprises/${loggedInEnterpriseId}`)
            const enterpriseData = await enterpriseResponse.json();
            setEnterprise(enterpriseData);
            const userResponse = await fetch(`http://localhost:3001/users/${loggedInUserId}`)
            const userData = await userResponse.json();
            setUser(userData);
        }
        loadData().then(() => setLoading(false));
    }, [])

    return (
        <>
            {!loading &&
                <>
                <Box
                    sx={{
                        backgroundSize: 'cover',
                        backgroundImage: `url(${img})`,
                        backgroundPosition: 'center center',

                        width: '100%',
                        height: '40vh',
                        /*position: 'absolute',
                        top: 0,
                        left: 0,*/
                    }}
                />
                <Stack sx={{ width: "60%", margin: "10px auto" }}>
                    <Typography variant="h1" sx={{ fontSize: "22px", fontWeight: "500", color: "rgba(0, 0, 0, 1)", m: "40px 0 10px 24px" }}>Profile</Typography>
                    <Typography variant="h2" sx={{ fontSize: "16px", fontWeight: "500", color: "rgba(0, 0, 0, 0.45)", m: "0 0 20px 24px" }}>Update the profile of your Barbershop here.</Typography>
                    <Paper elevation={2}>
                        <Stack
                            direction="column"
                            spacing={3}
                            divider={<Divider orientation="horizontal" flexItem />}
                            sx={{
                                padding: "24px 0",
                                "& > *": {
                                    padding: "0 48px",
                                },
                                "& > * > *": {
                                    flex: "1"
                                },
                                "& > * > p": {
                                    fontWeight: "500"
                                },
                                "& > * > * > p": {
                                    fontWeight: "500"
                                }
                            }}
                        >
                            <Stack direction="row">
                                <Typography variant="body1">Name</Typography>
                                <TextField
                                    InputLabelProps={{shrink: false}}
                                    name="name"
                                    placeholder="Name of the Enterprise"
                                    value={enterprise.name}
                                    onChange={handleEnterpriseChange}
                                    fullWidth
                                />
                            </Stack>

                            <Stack direction="row">
                                <Typography variant="body1">Address</Typography>
                                <TextField
                                    InputLabelProps={{shrink: false}}
                                    name="address"
                                    placeholder="e.g. Stuttgart"
                                    value={enterprise.address}
                                    onChange={handleEnterpriseChange}
                                    fullWidth
                                />
                            </Stack>

                            <Stack direction="row">
                                <Typography variant="body1">Phone Number</Typography>
                                <TextField
                                    InputLabelProps={{shrink: false}}
                                    name="phoneNumber"
                                    placeholder="e.g. 0157 12345678"
                                    value={enterprise.phoneNumber}
                                    onChange={handleEnterpriseChange}
                                    fullWidth
                                />
                            </Stack>

                            <Stack direction="row">
                                <Typography variant="body1">Website</Typography>
                                <TextField
                                    InputLabelProps={{shrink: false}}
                                    name="website"
                                    placeholder="e.g. http://www.my-company.de"
                                    value={enterprise.website}
                                    onChange={handleEnterpriseChange}
                                    fullWidth
                                />
                            </Stack>

                            <Stack direction="row">
                                <Typography variant="body1">E-Mail Address</Typography>
                                <TextField
                                    InputLabelProps={{shrink: false}}
                                    name="email"
                                    placeholder="e.g. my-company@support.de"
                                    value={enterprise.email}
                                    onChange={handleEnterpriseChange}
                                    fullWidth
                                />
                            </Stack>

                            <Stack direction="row">
                                <Stack direction="column" spacing={1}>
                                    <Typography variant="body1">Opening Time</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            name="open"
                                            value={dayjs(enterprise.hours.open, "hh-mm-A")}
                                            onChange={(newValue) => {
                                                setEnterprise({
                                                    ...enterprise,
                                                    hours: {
                                                        ...enterprise.hours,
                                                        open: newValue
                                                    }
                                                })
                                            }}
                                            renderInput={(params) => <TextField {...params} InputLabelProps={{shrink: false}} sx={{ paddingRight: "48px" }} />}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Stack direction="column" spacing={1}>
                                    <Typography variant="body1">Closing Time</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            name="close"
                                            value={dayjs(enterprise.hours.close, "hh-mm-A")}
                                            onChange={(newValue) => {
                                                setEnterprise({
                                                    ...enterprise,
                                                    hours: {
                                                        ...enterprise.hours,
                                                        close: newValue
                                                    }
                                                })
                                            }}
                                            renderInput={(params) => <TextField {...params} InputLabelProps={{shrink: false}} />}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                            </Stack>

                            <Stack direction="row">
                                <Typography variant="body1">Price Category</Typography>
                                <ToggleButtonGroup
                                    name="priceCategory"
                                    value={enterprise.priceCategory}
                                    exclusive
                                    onChange={(event, value) => {
                                        setEnterprise({
                                            ...enterprise,
                                            priceCategory: value
                                        })
                                    }}
                                    aria-label="Price category"
                                    sx={{ "& > button": { width: '70px', fontSize: '18px' }}}
                                >
                                    <ToggleButton value={1} aria-label="1">
                                        &#8364;
                                    </ToggleButton>
                                    <ToggleButton value={2} aria-label="2">
                                        &#8364; &#8364;
                                    </ToggleButton>
                                    <ToggleButton value={3} aria-label="3">
                                        &#8364; &#8364; &#8364;
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>

                            <Stack direction="row">
                                <Typography variant="body1">Payment Method</Typography>
                                <FormGroup>
                                    {paymentMethodOptions.map((method) => (
                                        <FormControlLabel
                                            name="paymentMethods"
                                            key={method}
                                            control={
                                                <Checkbox
                                                    checked={enterprise.paymentMethods.includes(method)}
                                                    onChange={(event) => handleEnterpriseArrayChange(event, method)}
                                                />
                                            }
                                            label={method
                                                .replace('ON_SITE_CASH', 'On Site (Cash)')
                                                .replace('ON_SITE_CARD', 'On Site (Card)')
                                                .replace('BANK_TRANSFER', 'Bank Transfer')
                                                .replace('PAYPAL', 'Paypal')
                                            }
                                            sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                                        />
                                    ))}
                                </FormGroup>
                            </Stack>

                            <Stack direction="row">
                                <Typography variant="body1">Drinks</Typography>
                                <FormGroup>
                                    {drinkOptions.map((drink) => (
                                        <FormControlLabel
                                            name="drinks"
                                            key={drink}
                                            control={
                                                <Checkbox
                                                    checked={enterprise.drinks.includes(drink)}
                                                    onChange={(event) => handleEnterpriseArrayChange(event, drink)}
                                                />
                                            }
                                            label={drink
                                                .replace('_', ' ')
                                                .toLowerCase()
                                            }
                                            sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                                        />
                                    ))}
                                </FormGroup>
                            </Stack>
                        </Stack>

                        <Divider orientation="horizontal" sx={{ m: "24px 0" }}  />

                        <ServiceTable
                            services={enterprise.services}
                            setServices={(newServices) => {
                                setEnterprise({
                                    ...enterprise,
                                    services: newServices
                                })
                            }}
                        />

                        <Divider orientation="horizontal" sx={{ m: "24px 0" }} />

                        <EmployeeTable
                            employees={enterprise.employees}
                            setEmployees={(newEmployees) => {
                                setEnterprise({
                                    ...enterprise,
                                    employees: newEmployees
                                })
                            }}
                        />

                    </Paper>

                    <Typography variant="h1" sx={{ fontSize: "22px", fontWeight: "500", color: "rgba(0, 0, 0, 1)", m: "40px 0 10px 24px" }}>Personal Info</Typography>
                    <Typography variant="h2" sx={{ fontSize: "16px", fontWeight: "500", color: "rgba(0, 0, 0, 0.45)", m: "0 0 20px 24px" }}>Update your personal information and account credentials here.</Typography>
                    <Paper elevation={2}>
                        <Stack
                            direction="column"
                            spacing={3}
                            divider={<Divider orientation="horizontal" flexItem />}
                            sx={{
                                padding: "24px 0",
                                "& > *": {
                                    padding: "0 48px",
                                },
                                "& > * > *": {
                                    flex: "1"
                                },
                                "& > * > p": {
                                    fontWeight: "500"
                                },
                                "& > * > * > p": {
                                    fontWeight: "500"
                                }
                            }}
                        >
                            <Stack direction="row">
                                <Stack direction="column" spacing={1}>
                                    <Typography variant="body1">First Name</Typography>
                                    <TextField
                                        InputLabelProps={{shrink: false}}
                                        name="name"
                                        placeholder="First Name"
                                        value={user.firstName}
                                        onChange={handleUserChange}
                                        /*fullWidth*/
                                        sx={{ paddingRight: "48px" }}
                                    />
                                </Stack>
                                <Stack direction="column" spacing={1}>
                                    <Typography variant="body1">First Name</Typography>
                                    <TextField
                                        InputLabelProps={{shrink: false}}
                                        name="name"
                                        placeholder="Last Name"
                                        value={user.lastName}
                                        onChange={handleUserChange}
                                        fullWidth
                                    />
                                </Stack>
                            </Stack>

                            <Stack direction="row">
                                <Typography variant="body1">E-Mail Address</Typography>
                                <TextField
                                    type="email"
                                    InputLabelProps={{shrink: false}}
                                    name="email"
                                    placeholder="E-Mail Address"
                                    value={user.email}
                                    onChange={handleUserChange}
                                    fullWidth
                                />
                            </Stack>

                            <Stack direction="row">
                                <Typography variant="body1">Password</Typography>
                                <TextField
                                    type="password"
                                    InputLabelProps={{shrink: false}}
                                    name="password"
                                    placeholder="Password"
                                    value={user.password}
                                    onChange={handleUserChange}
                                    fullWidth
                                />
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>

                </>
            }
        </>
    );
}

export default EditEnterprisePage;