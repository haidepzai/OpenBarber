// @ts-nocheck
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AuthContext from '../context/auth-context';
import EditPersonalInfo from '../components/EditShop/EditPersonalInfo.tsx';
import { useTranslation } from 'react-i18next';
import PersonalInfoForm from '../components/EditShop/PersonalInfoForm';
import PictureUpload from '../components/EditShop/PictureUpload';
import FormActions from '../components/EditShop/FormActions';
import SnackbarManager from '../components/EditShop/SnackbarManager';
import ServiceTable from '../components/EditShop/Service/ServiceTable.tsx';
import EmployeeTable from '../components/EditShop/Employee/EmployeeTable.tsx';
import { shopsAPI, usersAPI } from '../api/apiClient';
import { saveShopData } from '../components/EditShop/utils';

const EditShopPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveCooldown, setSaveCooldown] = useState(false);
  const [shop, setShop] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const saveCooldownTimerRef = useRef(null);

  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  const loadShop = async () => {
    const { data } = await shopsAPI.getByUser();
    setShop(data);
  };

  const loadUser = async () => {
    const { data } = await usersAPI.getById(authCtx.userId);
    authCtx.setUser(data);
  };

  useEffect(() => {
    const loadData = async () => {
      await loadUser();
      await loadShop();
      setLoading(false);
    };
    loadData();
  }, []);

  const saveShop = async () => {
    if (saving) {
      return;
    }

    setSaving(true);
    try {
      const savedShop = await saveShopData(shop);
      if (savedShop) {
        setShop(savedShop);
        handleSnackbarOpen('Save successful', 'success');
        setSaveCooldown(true);
      } else {
        handleSnackbarOpen('Could not save changes', 'error');
      }
    } catch (error) {
      handleSnackbarOpen('Could not save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetShop = async () => {
    await loadShop();
    handleSnackbarOpen(t('SHOP_DATA_RESET'));
  };

  const handleShopChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setShop({
      ...shop,
      [name]: value,
    });
  };

  const handleShopArrayChange = (event, value) => {
    const name = event.target.name;
    const checked = event.target.checked;
    if (checked) {
      setShop({
        ...shop,
        [name]: [...shop[name], value],
      });
    } else {
      setShop({
        ...shop,
        [name]: shop[name].filter((el) => el !== value),
      });
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const res = await shopsAPI.uploadLogo(shop.id, file);
      setShop((prev) => ({ ...prev, logo: res.data.logo }));
      handleSnackbarOpen(t('LOGO_UPLOADED'));
    } catch (err) {
      handleSnackbarOpen(t('UPLOAD_FAILED'), 'error');
    }
  };

  const handlePicturesUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    try {
      const res = await shopsAPI.uploadPictures(shop.id, files);
      setShop((prev) => ({ ...prev, pictures: res.data.pictures }));
      handleSnackbarOpen(t('PICTURES_UPLOADED'));
    } catch (err) {
      handleSnackbarOpen(t('UPLOAD_FAILED'), 'error');
    }
  };

  const handleDeletePicture = async (index) => {
    try {
      const res = await shopsAPI.deletePicture(shop.id, index);
      setShop((prev) => ({ ...prev, pictures: res.data.pictures }));
      handleSnackbarOpen(t('PICTURE_DELETED'));
    } catch (err) {
      handleSnackbarOpen(t('UPLOAD_FAILED'), 'error');
    }
  };

  const handleSnackbarOpen = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    if (!saveCooldown) {
      return undefined;
    }

    saveCooldownTimerRef.current = window.setTimeout(() => {
      setSaveCooldown(false);
      saveCooldownTimerRef.current = null;
    }, 5000);

    return () => {
      if (saveCooldownTimerRef.current) {
        window.clearTimeout(saveCooldownTimerRef.current);
        saveCooldownTimerRef.current = null;
      }
    };
  }, [saveCooldown]);

  return (
    <Box sx={{ overflowX: 'hidden', width: '100%' }}>
      {!loading && (
        <>
          {shop.logo && (
            <Box
              sx={{
                backgroundSize: 'cover',
                backgroundImage: `url(${shop.logo ? `data:image/jpeg;base64,${shop.logo}` : import.meta.env.VITE_BACKUP_IMAGE})`,
                backgroundPosition: 'center center',
                width: '100%',
                height: { xs: '24vh', sm: '32vh', md: '40vh' },
              }}
            />
          )}
          <Box sx={{ width: { xs: 'auto', md: '60%' }, margin: { xs: '10px 16px', md: '10px auto' }, overflowX: 'hidden' }}>
            <Typography variant="h1" sx={{ fontSize: '22px', fontWeight: '500', color: 'rgba(0, 0, 0, 1)', m: '40px 0 10px 0' }}>
              {t('PROFILE')}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.45)', m: '0 0 20px 0' }}>
              {t('EDIT_SHOP_TITLE')}
            </Typography>
            <Paper elevation={2} sx={{ overflow: 'hidden' }}>
              <PersonalInfoForm shop={shop} handleShopChange={handleShopChange} handleShopArrayChange={handleShopArrayChange} />

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <PictureUpload shop={shop} handleLogoUpload={handleLogoUpload} handlePicturesUpload={handlePicturesUpload} handleDeletePicture={handleDeletePicture} />

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <ServiceTable
                services={shop.services ?? []}
                setServices={(newServices) => {
                  setShop({
                    ...shop,
                    services: newServices,
                  });
                }}
              />

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <EmployeeTable
                employees={shop.employees ?? []}
                setEmployees={(newEmployees) => {
                  setShop({
                    ...shop,
                    employees: newEmployees,
                  });
                }}
              />

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <FormActions onReset={resetShop} onSave={saveShop} saving={saving} disabled={saveCooldown} />
            </Paper>

            <EditPersonalInfo onLoadingUser={loadUser} onOpenSnackBar={handleSnackbarOpen} />
          </Box>

          <SnackbarManager open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleSnackbarClose} />
        </>
      )}
    </Box>
  );
};

export default EditShopPage;
