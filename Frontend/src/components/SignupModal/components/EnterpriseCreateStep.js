import { Stack, Typography, Button, Box, TextField } from '@mui/material';
import React, { useContext } from 'react';
import { SignupContext } from '../Signup.context';

const PropInput = ({ label, vr, onBlur, error, name, ...props }) => {
  const { data, setData } = useContext(SignupContext);

  return (
    <TextField
      required
      label={label}
      variant="outlined"
      value={data[vr]}
      onChange={(e) => setData((d) => ({ ...d, [vr]: e.target.value }))}
      onBlur={onBlur}
      error={error}
      name={name}
      {...props}
    />
  );
};

const EnterpriseCreateStep = () => {
  const { setActiveStep, completedSteps, setCompletedSteps, close, data, setData } = useContext(SignupContext);

  const [newService, setNewService] = React.useState({
    detail: '',
    category: '',
    price: '',
  });
  const [errors, setErrors] = React.useState({
    detail: false,
    category: false,
    price: false,
    shopName: false,
    email: false,
    phone: false,
    headerUrl: false,
    desc: false,
    website: false,
    enterpriseName: false,
  });

  function onSubmit(e) {
    e.preventDefault();
    setActiveStep(3);
    setCompletedSteps((cs) => {
      const res = [...cs];
      res[2] = true;
      res[3] = true;
      return res;
    });
  }

  function onBlur(e) {
    console.log(e.target.value);
    if (e.target.value === '') {
      setErrors((err) => ({ ...err, [e.target.name]: true }));
    } else {
      setErrors((err) => ({ ...err, [e.target.name]: false }));
    }
  }
  function update(e) {
    setNewService((ns) => ({ ...ns, [e.target.name]: e.target.value }));
  }

  return (
    <Stack component="form" height="100%" gap={2} pt={16} onSubmit={onSubmit}>
      {/* <Typography variant="h4">Please enter some information about your enterprise.</Typography> */}

      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 3fr 2fr', gap: 8 }}>
        <Stack gap={4}>
          <Typography variant="h6">Enterprise Information</Typography>
          <PropInput label="Enterprise Name" vr="enterpriseName" onBlur={onBlur} error={errors.enterpriseName} name={'enterpriseName'} />
        </Stack>

        <Stack gap={4}>
          <Typography variant="h6">Setup your first Shop</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: 2 }}>
            <PropInput label="First Shop Name" vr="firstShopName" onBlur={onBlur} error={errors.shopName} name={'shopName'} />
            <PropInput label="Shop Email" vr="shopEmail" onBlur={onBlur} error={errors.email} name={'email'} />
            <PropInput label="Shop Phone" vr="shopPhone" onBlur={onBlur} error={errors.phone} name={'phone'} />
            <PropInput label="Shop Header Url" vr="shopHeaderUrl" onBlur={onBlur} error={errors.headerUrl} name={'headerUrl'} />
            <PropInput label="Shop Description" vr="shopDescription" onBlur={onBlur} error={errors.desc} name={'desc'} />
            <PropInput label="Shop Website" vr="shopWebsite" onBlur={onBlur} error={errors.website} name={'website'} />
          </Box>
        </Stack>

        <Stack gap={4}>
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
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="space-between" marginTop="auto" width="100%" gap={2}>
        <Button variant="outlined" onClick={close} tabIndex={-1}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={() => setActiveStep(1)}>
          Back
        </Button>
        <Box flexGrow={1} />
        <Button
          type="submit"
          disabled={
            !(
              data.enterpriseName &&
              data.firstShopName &&
              data.shopEmail &&
              data.shopPhone &&
              data.shopHeaderUrl &&
              data.shopDescription &&
              data.shopWebsite &&
              data.shopServices.length > 0
            )
          }
          variant="contained"
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};

export default EnterpriseCreateStep;
