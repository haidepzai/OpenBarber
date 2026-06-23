import React, { useEffect, useRef, useState, useContext } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AuthContext from '../context/auth-context.js';
import { getShopByUser } from '../actions/EnterpriseActions.js';
import { getUserById } from '../actions/UserActions.js';
import EditPersonalInfo from '../components/EditEnterprise/EditPersonalInfo.jsx';
import { useTranslation } from 'react-i18next';
import PersonalInfoForm from '../components/EditEnterprise/PersonalInfoForm';
import PictureUpload from '../components/EditEnterprise/PictureUpload';
import FormActions from '../components/EditEnterprise/FormActions';
import SnackbarManager from '../components/EditEnterprise/SnackbarManager';
import ServiceTable from '../components/EditEnterprise/Service/ServiceTable.tsx';
import EmployeeTable from '../components/EditEnterprise/Employee/EmployeeTable.tsx';
import { enterprisesAPI } from '../api/apiClient';
import { saveEnterpriseData } from '../components/EditEnterprise/utils.js';

const EditEnterprisePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveCooldown, setSaveCooldown] = useState(false);
  const [enterprise, setEnterprise] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const saveCooldownTimerRef = useRef(null);

  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  const loadEnterprise = async () => {
    const shop = await getShopByUser();
    setEnterprise(shop);
  };

  const loadUser = async () => {
    const userData = await getUserById(authCtx.userId);
    authCtx.setUser(userData);
  };

  useEffect(() => {
    const loadData = async () => {
      await loadUser();
      await loadEnterprise();
      setLoading(false);
    };
    loadData();
  }, []);

  const saveEnterprise = async () => {
    if (saving) {
      return;
    }

    setSaving(true);
    try {
      const savedEnterprise = await saveEnterpriseData(enterprise);
      if (savedEnterprise) {
        setEnterprise(savedEnterprise);
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

  const resetEnterprise = async () => {
    await loadEnterprise();
    handleSnackbarOpen(t('ENTERPRISE_DATA_RESET'));
  };

  const handleEnterpriseChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setEnterprise({
      ...enterprise,
      [name]: value,
    });
  };

  const handleEnterpriseArrayChange = (event, value) => {
    const name = event.target.name;
    const checked = event.target.checked;
    if (checked) {
      setEnterprise({
        ...enterprise,
        [name]: [...enterprise[name], value],
      });
    } else {
      setEnterprise({
        ...enterprise,
        [name]: enterprise[name].filter((el) => el !== value),
      });
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const res = await enterprisesAPI.uploadLogo(enterprise.id, file);
      setEnterprise((prev) => ({ ...prev, logo: res.data.logo }));
      handleSnackbarOpen(t('LOGO_UPLOADED'));
    } catch (err) {
      handleSnackbarOpen(t('UPLOAD_FAILED'), 'error');
    }
  };

  const handlePicturesUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    try {
      const res = await enterprisesAPI.uploadPictures(enterprise.id, files);
      setEnterprise((prev) => ({ ...prev, pictures: res.data.pictures }));
      handleSnackbarOpen(t('PICTURES_UPLOADED'));
    } catch (err) {
      handleSnackbarOpen(t('UPLOAD_FAILED'), 'error');
    }
  };

  const handleDeletePicture = async (index) => {
    try {
      const res = await enterprisesAPI.deletePicture(enterprise.id, index);
      setEnterprise((prev) => ({ ...prev, pictures: res.data.pictures }));
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
    <>
      {!loading && (
        <>
          {enterprise.logo && (
            <Box
              sx={{
                backgroundSize: 'cover',
                backgroundImage: `url(${enterprise.logo ? `data:image/jpeg;base64,${enterprise.logo}` : process.env.REACT_APP_BACKUP_IMAGE})`,
                backgroundPosition: 'center center',
                width: '100%',
                height: '40vh',
              }}
            />
          )}
          <Box sx={{ width: '60%', margin: '10px auto' }}>
            <Typography variant="h1" sx={{ fontSize: '22px', fontWeight: '500', color: 'rgba(0, 0, 0, 1)', m: '40px 0 10px 24px' }}>
              {t('PROFILE')}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.45)', m: '0 0 20px 24px' }}>
              {t('EDIT_ENTERPRISE_TITLE')}
            </Typography>
            <Paper elevation={2}>
              <PersonalInfoForm enterprise={enterprise} handleEnterpriseChange={handleEnterpriseChange} handleEnterpriseArrayChange={handleEnterpriseArrayChange} />

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <PictureUpload enterprise={enterprise} handleLogoUpload={handleLogoUpload} handlePicturesUpload={handlePicturesUpload} handleDeletePicture={handleDeletePicture} />

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <ServiceTable
                services={enterprise.services}
                setServices={(newServices) => {
                  setEnterprise({
                    ...enterprise,
                    services: newServices,
                  });
                }}
              />

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <EmployeeTable
                employees={enterprise.employees}
                setEmployees={(newEmployees) => {
                  setEnterprise({
                    ...enterprise,
                    employees: newEmployees,
                  });
                }}
              />

              <Divider orientation="horizontal" sx={{ m: '24px 0' }} />

              <FormActions onReset={resetEnterprise} onSave={saveEnterprise} saving={saving} disabled={saveCooldown} />
            </Paper>

            <EditPersonalInfo onLoadingUser={loadUser} onOpenSnackBar={handleSnackbarOpen} />
          </Box>

          <SnackbarManager open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleSnackbarClose} />
        </>
      )}
    </>
  );
};

export default EditEnterprisePage;
