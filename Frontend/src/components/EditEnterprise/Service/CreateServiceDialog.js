import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import { InputAdornment, Stack, TextField } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import EuroIcon from '@mui/icons-material/Euro';

const targetAudienceOptions = ['ALL', 'MEN', 'WOMEN', 'CHILDREN'];

const initialState = {
  targetAudience: '',
  title: '',
  durationInMin: 0,
  price: 0,
};

const CreateServiceDialog = ({ open, setOpen, editedService, setEditedService, uniqueServices, addService, updateService }) => {
  const editingMode = () => editedService && setEditedService && updateService && !addService;

  const [initialClick, setInitialClick] = useState(false);

  const [errors, setErrors] = useState({
    targetAudience: '',
    title: '',
    durationInMin: '',
    price: '',
  });

  const [service, setService] = useState(() => {
    if (editingMode()) {
      return editedService;
    } else {
      return initialState;
    }
  });

  const handleClose = () => {
    setOpen(false);
    if (editingMode()) {
      setEditedService(undefined);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setService({
      ...service,
      [name]: value,
    });
  };

  const validate = useCallback(() => {
    let targetAudienceError = '';
    let titleError = '';
    let durationInMinError = '';
    let priceError = '';
    const uniqueCombination = `${service.title + service.targetAudience}`;
    if (service.targetAudience === '') {
      targetAudienceError = 'Choose an option!';
    }
    if (service.title === '') {
      titleError = 'Choose a title!';
    }
    if (uniqueServices.includes(uniqueCombination)) {
      titleError = 'A Service with this title for this target audience already exists!';
    }
    if (service.durationInMin === '') {
      durationInMinError = 'Choose a duration (can be 0)!';
    } else if (service.durationInMin > 600) {
      durationInMinError = "Duration can't be over 600 minutes long!";
    }
    if (service.price === '') {
      priceError = 'Choose a price (can be 0)!';
    } else if (service.price > 10000) {
      priceError = "Price can't be over 100.000 Euros!";
    }
    setErrors({
      targetAudience: targetAudienceError,
      title: titleError,
      durationInMin: durationInMinError,
      price: priceError,
    });
    return !(targetAudienceError || titleError || durationInMinError || priceError);
  }, [service.durationInMin, service.price, service.targetAudience, service.title, uniqueServices]);

  useEffect(() => {
    validate();
  }, [service, validate]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{editingMode() ? 'Edit your service' : 'Add a service'}</DialogTitle>
        <DialogContent sx={{ width: '400px' }}>
          <Stack direction="column" spacing={4}>
            <TextField
              type="text"
              id="outlined-select-target"
              select
              label="Target Audience"
              defaultValue="ALL"
              name="targetAudience"
              fullWidth
              value={service.targetAudience}
              onChange={handleChange}
              sx={{ mt: '20px' }}
              error={initialClick && errors.targetAudience !== ''}
              helperText={initialClick && errors.targetAudience}
            >
              {targetAudienceOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="text"
              label="Title"
              name="title"
              placeholder="z.B. Trockenhaarschnitt"
              value={service.title}
              onChange={handleChange}
              fullWidth
              error={initialClick && errors.title !== ''}
              helperText={initialClick && errors.title}
            />

            <TextField
              type="number"
              label="Duration"
              name="durationInMin"
              value={service.durationInMin}
              onChange={handleChange}
              fullWidth
              error={initialClick && errors.durationInMin !== ''}
              helperText={initialClick && errors.durationInMin}
              InputProps={{
                endAdornment: <InputAdornment position="end">Minutes</InputAdornment>,
              }}
            />

            <TextField
              type="number"
              label="Price"
              name="price"
              value={service.price}
              onChange={handleChange}
              fullWidth
              error={initialClick && errors.price !== ''}
              helperText={initialClick && errors.price}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EuroIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', m: '8px 24px 24px 24px', p: '0' }}>
          <Button variant="outlined" onClick={handleClose} autoFocus>
            Cancel
          </Button>
          <Button
            variant="contained"
            /*disabled={!validate()}*/
            onClick={() => {
              if (validate()) {
                handleClose();
                if (editingMode()) {
                  updateService(service);
                  setEditedService(undefined);
                } else {
                  addService(service);
                  setService(initialState);
                }
                setInitialClick(false);
              }
              if (!initialClick) {
                setInitialClick(true);
              }
            }}
          >
            {editingMode() ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateServiceDialog;
