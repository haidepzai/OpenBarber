import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const SnackbarManager = ({ open, message, severity = 'success', onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarManager;
