import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import { InputAdornment, Stack, TextField } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import EuroIcon from '@mui/icons-material/Euro';
import { useTranslation } from 'react-i18next';

const targetAudienceOptions = ['ALL', 'MEN', 'WOMEN', 'CHILDREN'];

const initialState = {
  targetAudience: '',
  title: '',
  durationInMin: 0,
  price: 0,
};

const CreateServiceDialog = ({ open, setOpen, editedService, setEditedService, uniqueServices, addService, updateService }) => {
  const editingMode = () => editedService && setEditedService && updateService && !addService;

  const { t } = useTranslation();

  const [initialClick, setInitialClick] = useState(false);

  const [errors, setErrors] = useState({
    targetAudience: '',
    title: '',
    durationInMin: 0,
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
      targetAudienceError = t('CHOOSE_OPTION');
    }
    if (service.title === '') {
      titleError = t('CHOOSE_TITLE');
    }
    if (uniqueServices.includes(uniqueCombination)) {
      titleError = t('UNIQUE_ERROR');
    }
    if (service.durationInMin === '') {
      durationInMinError = t('CHOOSE_DURATION');
    } else if (service.durationInMin > 600) {
      durationInMinError = t('DURATION_ERROR');
    }
    if (service.price === '') {
      priceError = t('CHOOSE_PRICE');
    } else if (service.price > 10000) {
      priceError = t('PRICE_ERROR');
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
  }, [service]);

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
              placeholder={t('SERVICE_PLACEHOLDER')}
              value={service.title}
              onChange={handleChange}
              fullWidth
              error={initialClick && errors.title !== ''}
              helperText={initialClick && errors.title}
            />

            <TextField
              type="number"
              label={t('DURATION')}
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
              label={t('PRICE')}
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
            {t('CANCEL')}
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
            {editingMode() ? t('SAVE') : t('ADD')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateServiceDialog;
