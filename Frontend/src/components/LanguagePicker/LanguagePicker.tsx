import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'de', label: 'Deutsch', region: 'Deutschland' },
  { code: 'en', label: 'English', region: 'United States' },
  { code: 'ja', label: '日本語', region: '日本' },
];

const LanguagePicker = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="text"
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={() => setOpen(true)}
        sx={{ textTransform: 'none', fontWeight: 500, minWidth: 'unset' }}
      >
        {currentLang.code.toUpperCase()}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {t('CHOOSE_LANGUAGE')}
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={1}>
            {LANGUAGES.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <Grid item xs={12} sm={6} key={lang.code}>
                  <Box
                    onClick={() => handleSelect(lang.code)}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: '12px 16px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid' : '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight={isSelected ? 600 : 400}>
                        {lang.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lang.region}
                      </Typography>
                    </Box>
                    {isSelected && <CheckIcon color="primary" fontSize="small" />}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LanguagePicker;
