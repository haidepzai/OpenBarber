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
      <Avatar alt={employee.name} src={employee.picture} sx={{ width: 50, height: 50 }} />
      <Box>
        <Typography sx={{ lineHeight: 'unset' }}>{employee.name}</Typography>
        <Typography
          variant="overline"
          sx={{
            textTransform: 'uppercase',
            lineHeight: 'unset',
            color: '#666',
          }}
        >
          {employee.titel}
        </Typography>
      </Box>
    </Stack>
  );
};

export default Stylist;
