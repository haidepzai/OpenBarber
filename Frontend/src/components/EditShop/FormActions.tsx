import React from 'react';
import { Stack, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const FormActions = ({ onReset, onSave, saving = false, disabled = false }) => {
  const { t } = useTranslation();
  const isDisabled = saving || disabled;

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} alignContent="center" justifyContent="space-between" sx={{ p: '0 24px 24px 24px' }} spacing={2}>
      <Button variant="outlined" onClick={onReset} disabled={isDisabled} sx={{ width: { xs: '100%', sm: 'auto' } }}>
        {t('RESET')}
      </Button>
      <Button variant="contained" onClick={onSave} disabled={isDisabled} sx={{ width: { xs: '100%', sm: 'auto' } }}>
        {saving ? 'Saving...' : t('SAVE_CHANGES')}
      </Button>
    </Stack>
  );
};

export default FormActions;
