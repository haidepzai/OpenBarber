import { Stack, Typography, Button, Box, TextField } from '@mui/material';
import React, { useContext } from 'react';
import { SignupContext } from '../../../context/Signup.context';
import { usePlacesWidget } from 'react-google-autocomplete';
import axios from 'axios';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API;

const PropInput = (props) => {
  const { data, setData } = useContext(SignupContext);

  return (
    <TextField
      required
      {...props.input}
      variant="outlined"
      value={data[props.input.vr]}
      onChange={(e) => setData((d) => ({ ...d, [props.input.vr]: e.target.value }))}
    />
  );
};

const EnterpriseCreateStep = () => {
  const { setActiveStep, setCompletedSteps, close, data, setData } = useContext(SignupContext);

  const [errors, setErrors] = React.useState({
    enterpriseName: false,
    enterpriseOwner: false,
    enterpriseCity: false,
    enterpriseStreet: false,
  });
  const { ref: acRef } = usePlacesWidget({
    apiKey: GOOGLE_API_KEY,
    onPlaceSelected: (place) => {
      console.log('new street:', place);
      setData((d) => ({ ...d, enterpriseStreet: place }));
    },
    options: {
      types: ['address'],
    },
  });

  async function onSubmit(e) {
    e.preventDefault();

    // function toFormData(obj) {
    //   const formData = new FormData();
    //   for (const key in obj) {
    //     if (obj[key] instanceof FileList || Array.isArray(obj[key])) {
    //       for (let i = 0; i < obj[key].length; i++) {
    //         formData.append(key, obj[key][i]);
    //       }
    //     } else {
    //       formData.append(key, obj[key]);
    //     }
    //   }
    //   return formData;
    // }
    const createEnterpriseReq = {
      email: data.email,
      name: data.enterpriseName,
      owner: data.enterpriseOwner,
      address: data.enterpriseStreet.formatted_address,
      addressLongitude: Number(data.enterpriseStreet.geometry.location.lng()),
      addressLatitude: Number(data.enterpriseStreet.geometry.location.lat()),
    };

    // form data config
    const customConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('tokenJWT')).token,
      },
    };

    try {
      const res = await axios.post('http://localhost:8080/api/enterprises', createEnterpriseReq, customConfig);
      console.log('response', res);

      setActiveStep(2);
      setCompletedSteps((cs) => {
        const res = [...cs];
        res[1] = true;
        return res;
      });
    } catch (err) {
      console.log(err);
    }

  }

  function onBlur(e) {
    if (e.target.value === '') {
      setErrors((err) => ({ ...err, [e.target.name]: true }));
    } else {
      setErrors((err) => ({ ...err, [e.target.name]: false }));
    }
  }

  return (
    <Stack component="form" height="100%" gap={2} pt={8} onSubmit={onSubmit}>
      {/* <Typography variant="h4">Please enter some information about your enterprise.</Typography> */}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '800px' }}>
        <Stack gap={4}>
          <Typography variant="h6">Setup your Enterprise</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: 2 }}>
            <PropInput
              input={{
                label: 'Enterprise Name',
                vr: 'enterpriseName',
                onBlur: onBlur,
                error: errors.enterpriseName,
                name: 'enterpriseName',
              }}
            />

            <PropInput
              input={{
                label: 'Enterprise Owner',
                vr: 'enterpriseOwner',
                onBlur: onBlur,
                error: errors.enterpriseOwner,
                name: 'enterpriseOwner',
              }}
            />

            <TextField
              required
              variant="outlined"
              onChange={() => setData((d) => ({ ...d, enterpriseStreet: null }))}
              label="Address"
              value={data.enterpriseStreet ? data.enterpriseStreet.formatted_address : undefined}
              name="enterpriseStreet"
              error={errors.enterpriseStreet}
              onBlur={onBlur}
              inputRef={acRef}
              sx={{
                gridColumn: '1/3',
              }}
            />
          </Box>
        </Stack>

        {/* <Stack gap={4}>
          <Typography variant="h6">Add Services</Typography>
          <Stack gap={2} gridRow="2/4" gridColumn="3/4">
            <TextField
              label="Service Detail"
              variant="outlined"
              onBlur={onBlur}
              name="detail"
              error={errors.detail}
              value={newService.detail}
              onInput={update}
            />
            <Stack direction="row" gap={2}>
              <TextField
                label="Service Category"
                variant="outlined"
                sx={{ flexGrow: '1' }}
                onBlur={onBlur}
                name="category"
                error={errors.category}
                value={newService.category}
                onInput={update}
              />
              <TextField
                label="Service Price"
                variant="outlined"
                sx={{ flexGrow: '1' }}
                onBlur={onBlur}
                name="price"
                error={errors.price}
                value={newService.price}
                onInput={update}
              />
              <Button
                variant="contained"
                onClick={() => {
                  if (newService.detail === '' || newService.category === '' || newService.price === 0) return;
                  setData((d) => ({ ...d, shopServices: [...d.shopServices, newService] }));
                }}
              >
                Add
              </Button>
            </Stack>
            <Stack gap={2} overflow="hidden auto" pl={1}>
              {data.shopServices.map((service, index) => (
                <Stack direction="row" key={index} gap={2} alignItems="center">
                  <Typography fontSize={12}>{index + 1}.</Typography>
                  <Typography fontSize={12}>{service.detail}</Typography>
                  <Typography fontSize={12} mr="auto" color="secondary.main">
                    {service.price}
                  </Typography>
                  <Typography
                    fontSize={10}
                    height={20}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      paddingX: 1,
                      borderRadius: 100,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {service.category}
                  </Typography>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setData((d) => ({ ...d, shopServices: d.shopServices.filter((_, i) => i !== index) }))}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack> */}
      </Box>

      <Stack direction="row" justifyContent="space-between" marginTop="auto" width="100%" gap={2}>
        <Button variant="outlined" onClick={close} tabIndex={-1}>
          Cancel
        </Button>
        {/* <Button variant="outlined" onClick={() => setActiveStep(0)}>
          Back
        </Button> */}
        <Box flexGrow={1} />
        <Button type="submit" disabled={!(data.enterpriseName && data.enterpriseOwner && data.enterpriseStreet)} variant="contained">
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};

export default EnterpriseCreateStep;
