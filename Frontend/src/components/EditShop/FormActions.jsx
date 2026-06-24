import React from 'react';
import { Stack, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const FormActions = ({ onReset, onSave, saving = false, disabled = false }) => {
  const { t } = useTranslation();
  const isDisabled = saving || disabled;

  return (
    <Stack direction="row" alignContent="center" justifyContent="space-between" sx={{ p: '0 24px 24px 24px' }} spacing={4}>
      <Button variant="outlined" onClick={onReset} disabled={isDisabled}>
        {t('RESET')}
      </Button>
      <Button variant="contained" onClick={onSave} disabled={isDisabled}>
        {saving ? 'Saving...' : t('SAVE_CHANGES')}
      </Button>
    </Stack>
  );
};

export default FormActions;
