import React, { useEffect, useState } from 'react';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SnackbarManager = ({ snackPack, onExited, onClose }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackbarOpen(true);
    } else if (snackPack.length && messageInfo && snackbarOpen) {
      setSnackbarOpen(false);
    }
  }, [snackPack, messageInfo, snackbarOpen]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    onClose && onClose();
  };

  const handleExited = () => {
    setMessageInfo(undefined);
    onExited && onExited();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      key={messageInfo ? messageInfo.key : undefined}
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      message={messageInfo ? messageInfo.message : undefined}
      action={
        <React.Fragment>
          <IconButton aria-label="close" color="inherit" sx={{ p: 0.5 }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
    />
  );
};

export default SnackbarManager;
