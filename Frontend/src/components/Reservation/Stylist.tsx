import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

const Stylist = ({ employee, onClick }) => {
  return (
    <Stack
      position="relative"
      direction="row"
      alignItems="center"
      gap="15px"
      sx={{
        borderTop: '0.5px solid rgb(236,236,236)',
        padding: '10px 20px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Avatar alt={employee.name} src={employee.picture ? `data:image/jpeg;base64,${employee.picture}` : undefined} sx={{ width: 50, height: 50 }} />
      <Box>
        <Typography sx={{ lineHeight: 'unset' }}>
          {employee.name}
          {employee.title ? ` – ${employee.title}` : ''}
        </Typography>
      </Box>
    </Stack>
  );
};

export default Stylist;
