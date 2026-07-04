// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Stack, Avatar, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/auth-context';
import { usersAPI } from '../api/apiClient';

const CustomerEditProfilePage = () => {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);

  const [form, setForm] = useState({
    salutation: 'None',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await usersAPI.getInfo();
        const u = res.data;
        setForm({
          salutation: u.salutation || 'None',
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          phoneNumber: u.phoneNumber || '',
        });
        if (u.profilePhoto) {
          setPhoto(`data:image/jpeg;base64,${u.profilePhoto}`);
        }
      } catch (e) {}
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
    setError('');
    try {
      await usersAPI.uploadPhoto(authCtx.userId, file);
    } catch (err) {
      setError(t('PHOTO_UPLOAD_FAILED', 'Foto-Upload fehlgeschlagen'));
    }
  };

  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!form.firstName?.trim()) errors.firstName = true;
    if (!form.lastName?.trim()) errors.lastName = true;
    if (!form.phoneNumber?.trim()) errors.phoneNumber = true;
    if (!form.salutation || form.salutation === 'None') errors.salutation = true;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      await usersAPI.update(authCtx.userId, {
        firstName: form.firstName,
        lastName: form.lastName,
        name: `${form.firstName} ${form.lastName}`.trim(),
        phoneNumber: form.phoneNumber,
        salutation: form.salutation !== 'None' ? form.salutation : null,
      });
      // Update auth context so ReservationDialog has fresh data
      authCtx.setUser((prev) => ({ ...prev, ...form }));
      setSuccess(true);
    } catch (err) {
      setError(t('SAVE_FAILED', 'Speichern fehlgeschlagen'));
    } finally {
      setSaving(false);
    }
  };

  const initials = [form.firstName?.[0], form.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';

  return (
    <Box sx={{ width: { xs: 'auto', sm: '100%' }, maxWidth: 500, margin: { xs: '40px 16px', sm: '40px auto' }, minHeight: '60vh' }}>
      <Typography variant="h4" fontWeight={600} mb={4}>
        {t('EDIT_PROFILE', 'Profil bearbeiten')}
      </Typography>

      {/* Avatar */}
      <Stack alignItems="center" mb={4}>
        <Avatar src={photo || undefined} sx={{ width: 100, height: 100, mb: 2, fontSize: 36 }}>
          {!photo && initials}
        </Avatar>
        <Button variant="outlined" component="label" size="small">
          {t('UPLOAD_PHOTO', 'Foto hochladen')}
          <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
        </Button>
      </Stack>

      {/* Salutation */}
      <FormControl fullWidth sx={{ mb: fieldErrors.salutation ? 1 : 3 }} error={!!fieldErrors.salutation}>
        <InputLabel>{t('SALUTATION', 'Anrede')} *</InputLabel>
        <Select name="salutation" value={form.salutation} label={`${t('SALUTATION', 'Anrede')} *`} onChange={handleChange}>
          <MenuItem value="None">{t('NO_SELECTION', 'Keine Angabe')}</MenuItem>
          <MenuItem value="Mr.">{t('MR', 'Herr')}</MenuItem>
          <MenuItem value="Mrs.">{t('MRS', 'Frau')}</MenuItem>
        </Select>
        {fieldErrors.salutation && (
          <Typography variant="caption" color="error" sx={{ ml: 1.75, mt: 0.5 }}>
            {t('CANT_BE_EMPTY', 'Pflichtfeld')}
          </Typography>
        )}
      </FormControl>

      {/* Name fields */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <TextField
          label={`${t('FIRST_NAME', 'Vorname')} *`}
          name="firstName"
          fullWidth
          value={form.firstName}
          onChange={handleChange}
          error={!!fieldErrors.firstName}
          helperText={fieldErrors.firstName && t('CANT_BE_EMPTY', 'Pflichtfeld')}
        />
        <TextField
          label={`${t('LAST_NAME', 'Nachname')} *`}
          name="lastName"
          fullWidth
          value={form.lastName}
          onChange={handleChange}
          error={!!fieldErrors.lastName}
          helperText={fieldErrors.lastName && t('CANT_BE_EMPTY', 'Pflichtfeld')}
        />
      </Stack>

      {/* Phone */}
      <TextField
        label={`${t('PHONE_NUMBER', 'Telefonnummer')} *`}
        name="phoneNumber"
        fullWidth
        value={form.phoneNumber}
        onChange={handleChange}
        error={!!fieldErrors.phoneNumber}
        helperText={fieldErrors.phoneNumber && t('CANT_BE_EMPTY', 'Pflichtfeld')}
        sx={{ mb: 3 }}
      />

      {/* Email (readonly) */}
      <TextField label={t('EMAIL_ADDRESS', 'E-Mail')} fullWidth value={authCtx.email || ''} disabled sx={{ mb: 3 }} />

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('SAVED', 'Gespeichert!')}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button variant="contained" fullWidth onClick={handleSave} disabled={saving}>
        {saving ? <CircularProgress size={22} /> : t('SAVE', 'Speichern')}
      </Button>
    </Box>
  );
};

export default CustomerEditProfilePage;
