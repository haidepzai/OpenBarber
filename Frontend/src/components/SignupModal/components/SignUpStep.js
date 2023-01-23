import React, { useState } from 'react';

import { Stack, TextField } from '@mui/material';

const SignUpStep = () => {

  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Stack gap={2} mt={8} mb="auto">
      <TextField
        label="Company Email"
        required
        error={!emailIsValid}
        helperText={!emailIsValid && 'Please enter a correct email'}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        required
        error={!passwordIsValid}
        helperText={!passwordIsValid && 'Please enter a password'}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Confirm Password"
        required
        error={!passwordIsValid}
        helperText={!passwordIsValid && 'Please enter a password'}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Stack>
  );
};

export default SignUpStep;
