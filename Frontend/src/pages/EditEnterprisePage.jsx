import React, { useEffect, useState, useContext } from 'react';
import { Box, Checkbox, Divider, FormGroup, ImageListItemBar, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Button from '@mui/material/Button';
import CollectionsIcon from '@mui/icons-material/Collections';
import FormControlLabel from '@mui/material/FormControlLabel';
import ServiceTable from '../components/EditEnterprise/Service/ServiceTable.tsx';
import EmployeeTable from '../components/EditEnterprise/Employee/EmployeeTable.tsx';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import AuthContext from '../context/auth-context.js';
import { getShopByEmail } from '../actions/EnterpriseActions.js';
import { getUserById } from '../actions/UserActions.js';
import EditPersonalInfo from '../components/EditEnterprise/EditPersonalInfo.jsx';
import { useTranslation } from 'react-i18next';

const paymentMethodOptions = ['ON_SITE_CASH', 'ON_SITE_CARD', 'BANK_TRANSFER', 'PAYPAL'];
const drinkOptions = ['COFFEE', 'TEA', 'WATER', 'SOFT_DRINKS', 'BEER', 'CHAMPAGNE', 'SPARKLING_WINE'];

const EditEnterprisePage = () => {
  const [loading, setLoading] = useState(true);
  const [enterprise, setEnterprise] = useState({});

  const authCtx = useContext(AuthContext);

  const { t } = useTranslation();

  const enterpriseUrl = `${process.env.REACT_APP_BACKEND_URL}/enterprises/`;

  // PERSISTENCE METHODS

  const loadEnterprise = async () => {
    const shop = await getShopByEmail(authCtx.email);
    setEnterprise(shop);
  };

  const loadUser = async () => {
    const userData = await getUserById(authCtx.userId);
    authCtx.setUser(userData);
  };

  const loadData = async () => {
    await loadUser();
    await loadEnterprise();
    setLoading(false);
  };

  const saveEnterprise = async () => {
    console.log(enterprise);
    await fetch(`${enterpriseUrl}${enterprise.id}`, {
      method: 'PUT',
      body: JSON.stringify(enterprise),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    // IMAGES - FormData

    const imageFormData = new FormData();
    imageFormData.append('logo', enterprise.logo);
    enterprise.pictures.forEach((picture, index) => {
      imageFormData.append(`pictures[${index}]`, picture);
    });
    enterprise.employees.forEach((employee, index) => {
      Object.keys(employee).forEach((key) => {
        imageFormData.append(`employees[${index}].${key}`, employee[key]);
      });
    });

    for (var [key, value] of imageFormData.entries()) {
      console.log(key, value);
    }

    // TODO: send to backend + USER IMAGE UPLOAD...

    /*await fetch(enterpriseUrl, {
            method: "PATCH",
            body: imageFormData
        })*/

    handleSnackbarOpen(t('ENTERPRISE_CHANGES_SAVED'));
  };

  const resetEnterprise = async () => {
    await loadEnterprise();
    handleSnackbarOpen(t('ENTERPRISE_DATA_RESET'));
  };

  // CLIENT-ONLY METHODS

  const handleEnterpriseChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setEnterprise({
      ...enterprise,
      [name]: value,
    });
  };

  const handleEnterpriseArrayChange = (event, value) => {
    const name = event.target.name;
    const checked = event.target.checked;
    if (checked) {
      setEnterprise({
        ...enterprise,
        [name]: [...enterprise[name], value],
      });
    } else {
      setEnterprise({
        ...enterprise,
        [name]: enterprise[name].filter((el) => el !== value),
      });
    }
  };

  const handleLogoUpload = (event) => {
    setEnterprise({
      ...enterprise,
      logo: event.target.files[0],
    });
  };

  const handlePicturesUpload = (event) => {
    setEnterprise({
      ...enterprise,
      pictures: Array.from(event.target.files),
    });
  };

  const handleDeletePicture = (deletedName) => {
    const newPictures = enterprise.pictures.filter((picture) => picture.name !== deletedName);
    setEnterprise({
      ...enterprise,
      pictures: newPictures,
    });
  };

  /* START - SNACKBAR */

  const [snackPack, setSnackPack] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setSnackbarOpen(true);
    } else if (snackPack.length && messageInfo && snackbarOpen) {
      // Close an active snack when a new one is added
      setSnackbarOpen(false);
    }
  }, [snackPack, messageInfo, snackbarOpen]);

  const handleSnackbarOpen = (message) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSnackbarExited = () => {
    setMessageInfo(undefined);
  };

  /* END - SNACKBAR */

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {!loading && (
        <>
          {enterprise.logo && (
            <Box
              sx={{
                backgroundSize: 'cover',
                backgroundImage: `url(${URL.createObjectURL(enterprise.logo)})`,
                backgroundPosition: 'center center',

                width: '100%',
                height: '40vh',
              }}
            />
          )}
          <Box sx={{ width: '60%', margin: '10px auto' }}>
            <Typography variant="h1" sx={{ fontSize: '22px', fontWeight: '500', color: 'rgba(0, 0, 0, 1)', m: '40px 0 10px 24px' }}>
              {t('PROFILE')}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.45)', m: '0 0 20px 24px' }}>
              {t('EDIT_ENTERPRISE_TITLE')}
            </Typography>
            <Paper elevation={2}>
              <Stack
                direction="column"
                spacing={3}
                divider={<Divider orientation="horizontal" flexItem />}
                sx={{
                  padding: '24px 0',
                  '& > *': {
                    padding: '0 48px',
                  },
                  '& > * > *': {
                    flex: '1',
                  },
                  '& > * > p': {
                    fontWeight: '500',
                  },
                  '& > * > * > p': {
                    fontWeight: '500',
                  },
                }}
              >
                <Stack direction="row">
                  <Typography variant="body1">{t('NAME')}</Typography>
                  <TextField
                    InputLabelProps={{ shrink: false }}
                    name="name"
                    placeholder={t('NAME_ENTERPRISE')}
                    value={enterprise.name === null ? '' : enterprise.name}
                    onChange={handleEnterpriseChange}
                    fullWidth
                  />
                </Stack>

                <Stack direction="row">
                  <Typography variant="body1">{t('ADDRESS')}</Typography>
                  <TextField
                    InputLabelProps={{ shrink: false }}
                    name="address"
                    placeholder={t('ADDRESS_EXAMPLE')}
                    value={enterprise.address === null ? '' : enterprise.address}
                    onChange={handleEnterpriseChange}
                    fullWidth
                  />
                </Stack>

                <Stack direction="row">
                  <Typography variant="body1">{t('PHONE_NUMBER')}</Typography>
                  <TextField
                    InputLabelProps={{ shrink: false }}
                    name="phoneNumber"
                    placeholder={t('PHONE_NUMBER_EXAMPLE')}
                    value={enterprise.phoneNumber === null ? '' : enterprise.phoneNumber}
                    onChange={handleEnterpriseChange}
                    fullWidth
                    type="number"
                  />
                </Stack>

                <Stack direction="row">
                  <Typography variant="body1">{t('WEBSITE')}</Typography>
                  <TextField
                    InputLabelProps={{ shrink: false }}
                    name="website"
                    placeholder={t('WEBSITE_EXAMPLE')}
                    value={enterprise.website === null ? '' : enterprise.website}
                    onChange={handleEnterpriseChange}
                    fullWidth
                  />
                </Stack>

                <Stack direction="row">
                  <Typography variant="body1">{t('EMAIL_ADDRESS')}</Typography>
                  <TextField
                    InputLabelProps={{ shrink: false }}
                    name="email"
                    placeholder={t('EMAIL_ADDRESS_EXAMPLE')}
                    value={enterprise.email === null ? '' : enterprise.email}
                    onChange={handleEnterpriseChange}
                    fullWidth
                  />
                </Stack>

                <Stack direction="row">
                  <Stack direction="column" spacing={1}>
                    <Typography variant="body1">{t('OPENING_TIME')}</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        name="open"
                        label={!enterprise.openingTime && 'Open'}
                        value={enterprise.openingTime === null ? '' : enterprise.openingTime}
                        onChange={(newValue) => {
                          // date must always be the same in order to compare time(s) later (in filter)
                          const changedValue = newValue.set('year', 2023).set('month', 0).set('date', 1);
                          setEnterprise({
                            ...enterprise,
                            openingTime: changedValue.toISOString(),
                          });
                        }}
                        renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: false }} sx={{ paddingRight: '48px' }} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction="column" spacing={1}>
                    <Typography variant="body1">{t('CLOSING_TIME')}</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        name="close"
                        label={!enterprise.closingTime && 'Close'}
                        value={enterprise.closingTime === null ? '' : enterprise.closingTime}
                        onChange={(newValue) => {
                          // date must always be the same in order to compare time(s) later (in filter)
                          const changedValue = newValue.set('year', 2023).set('month', 0).set('date', 1);
                          setEnterprise({
                            ...enterprise,
                            closingTime: changedValue.toISOString(),
                          });
                        }}
                        renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: false }} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Stack>

                <Stack direction="row">
                  <Typography variant="body1">{t('PRICE_CATEGORY')}</Typography>
                  <ToggleButtonGroup
                    name="priceCategory"
                    value={enterprise.priceCategory === null ? '' : enterprise.priceCategory}
                    exclusive
                    onChange={(event, value) => {
                      setEnterprise({
                        ...enterprise,
                        priceCategory: value,
                      });
                    }}
                    aria-label="Price category"
                    sx={{ '& > button': { width: '70px', fontSize: '18px' } }}
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
                  <Typography variant="body1">{t('PAYMENT_METHOD')}</Typography>
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
                          .replace('PAYPAL', 'Paypal')}
                        sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                      />
                    ))}
                  </FormGroup>
                </Stack>

                <Stack direction="row">
                  <Typography variant="body1">{t('DRINKS')}</Typography>
                  <FormGroup>
                    {drinkOptions.map((drink) => (
                      <FormControlLabel
                        name="drinks"
                        key={drink}
                        control={
                          <Checkbox checked={enterprise.drinks.includes(drink)} onChange={(event) => handleEnterpriseArrayChange(event, drink)} />
                        }
                        label={drink.replace('_', ' ').toLowerCase()}
                        sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                      />
                    ))}
                  </FormGroup>
                </Stack>
              </Stack>

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <Box sx={{ padding: '0 48px' }}>
                <Stack direction="row">
                  <Typography variant="body1" sx={{ flex: '1', fontWeight: '500' }}>
                    Logo
                  </Typography>
                  <Box sx={{ flex: '1' }}>
                    <Button variant="contained" component="label" endIcon={<PhotoCamera />}>
                      Upload Logo
                      <input type="file" hidden accept="image/png, image/jpeg" onChange={handleLogoUpload} />
                    </Button>
                  </Box>
                </Stack>
                {enterprise.logo && (
                  <Box sx={{ mt: '24px' }}>
                    <img
                      alt="enterprise logo"
                      src={URL.createObjectURL(enterprise.logo)}
                      width="100%"
                      height="auto"
                      style={{ maxHeight: '250px', objectFit: 'cover' }}
                    />
                  </Box>
                )}
              </Box>

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <Box sx={{ padding: '0 48px' }}>
                <Stack direction="row">
                  <Typography variant="body1" sx={{ flex: '1', fontWeight: '500' }}>
                    {t('PICTURES')}
                  </Typography>
                  <Box sx={{ flex: '1' }}>
                    <Button variant="contained" component="label" endIcon={<CollectionsIcon />}>
                      {t('UPLOAD_PICTURES')}
                      <input type="file" hidden multiple accept="image/png, image/jpeg" onChange={handlePicturesUpload} />
                    </Button>
                  </Box>
                </Stack>
                {enterprise.pictures && enterprise.pictures.length > 0 && (
                  <Box sx={{ mt: '24px' }}>
                    <ImageList sx={{ width: '100%', height: '444px', borderRadius: '5px', boxShadow: 4 }} cols={4} rowHeight={220} variant="quilted">
                      {enterprise.pictures.map((picture) => (
                        <ImageListItem key={picture.name}>
                          <img
                            /*src={`${URL.createObjectURL(picture)}?w=164&h=164&fit=crop&auto=format`}
                                                        srcSet={`${URL.createObjectURL(picture)}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/
                            /*src={URL.createObjectURL(picture)}*/
                            src={URL.createObjectURL(picture)}
                            alt={picture.name}
                            loading="lazy"
                            /*width="164px"
                                                        height="164px"*/
                            style={{ objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                          />
                          <ImageListItemBar
                            sx={{
                              background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                            }}
                            /*title="Delete"*/
                            position="top"
                            actionPosition="left"
                            actionIcon={
                              <IconButton sx={{ color: 'white' }} onClick={() => handleDeletePicture(picture.name)}>
                                <DeleteOutlineIcon color="white" />
                              </IconButton>
                            }
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                )}
              </Box>

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <ServiceTable
                services={enterprise.services}
                setServices={(newServices) => {
                  setEnterprise({
                    ...enterprise,
                    services: newServices,
                  });
                }}
              />

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <EmployeeTable
                employees={enterprise.employees}
                setEmployees={(newEmployees) => {
                  setEnterprise({
                    ...enterprise,
                    employees: newEmployees,
                  });
                }}
              />

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <Stack direction="row" alignContent="center" justifyContent="space-between" sx={{ p: '0 24px 24px 24px' }} spacing={4}>
                <Button variant="outlined" onClick={resetEnterprise}>
                  {t('RESET')}
                </Button>
                <Button variant="contained" onClick={saveEnterprise}>
                  {t('SAVE_CHANGES')}
                </Button>
              </Stack>
            </Paper>

            <EditPersonalInfo onLoadingUser={loadUser} onOpenSnackBar={handleSnackbarOpen}></EditPersonalInfo>
          </Box>

          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            key={messageInfo ? messageInfo.key : undefined}
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            TransitionProps={{ onExited: handleSnackbarExited }}
            message={messageInfo ? messageInfo.message : undefined}
            action={
              <React.Fragment>
                {/*<Button color="secondary" size="small" onClick={handleSnackbarClose}>
                                    UNDO
                                </Button>*/}
                <IconButton aria-label="close" color="inherit" sx={{ p: 0.5 }} onClick={handleSnackbarClose}>
                  <CloseIcon />
                </IconButton>
              </React.Fragment>
            }
          />
        </>
      )}
    </>
  );
};

export default EditEnterprisePage;
