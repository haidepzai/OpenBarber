import { Stack, Typography, Button, Box, TextField } from '@mui/material'
import React, { useContext } from 'react'
import { SignupContext } from '../Signup.context';


const PropInput = ({ label, vr, ...props }) => {
  const { data, setData } = useContext(SignupContext);

  return (
    <TextField
      label={label}
      variant="outlined"
      value={data[vr]}
      onChange={(e) => setData((d) => ({ ...d, [vr]: e.target.value }))}
      {...props}
    />
  );
}


const EnterpriseCreateStep = () => {

  const {
    data: {
      enterpriseName,
      firstShopName,
      shopPhone,
      shopDescription,
      shopEmail,
      shopHeaderUrl,
      shopWebsite,
      shopServices,
    },
    setActiveStep,
    completedSteps,
    close
  } = useContext(SignupContext);

  function onSubmit(e) {
    e.preventDefault();
  }

  return (
    <Stack component="form" height="100%" gap={2} pt={16} onSubmit={onSubmit}>
      <Typography variant="h4">Please enter some information about your enterprise.</Typography>
      
      {/* add form inputs for all properties like enterpriseDescription */}
      <PropInput label="Enterprise Name" vr="enterpriseName" />
      
      <PropInput label="First Shop Name" vr="firstShopName" />
      <PropInput label="Shop Phone" vr="shopPhone" />
      <PropInput label="Shop Description" vr="shopDescription" />
      <PropInput label="Shop Email" vr="shopEmail" />
      <PropInput label="Shop Header Url" vr="shopHeaderUrl" />
      <PropInput label="Shop Website" vr="shopWebsite" />

      {/* Services selector */}


      <Stack direction="row" justifyContent="space-between" marginTop="auto" width="100%" gap={2}>
        <Button variant="outlined" onClick={close}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={() => setActiveStep(1)}>
          Back
        </Button>
        <Box flexGrow={1} />
        <Button type="submit" disabled={completedSteps.slice(0, 1).some((e) => !e)} variant="outlined">
          Continue
        </Button>
      </Stack>
    </Stack>
  )
}

export default EnterpriseCreateStep