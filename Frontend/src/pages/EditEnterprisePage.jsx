import React, { useEffect, useState, useContext } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import AuthContext from '../context/auth-context.js';
import { getShopByEmail } from '../actions/EnterpriseActions.js';
import { getUserById } from '../actions/UserActions.js';
import EditPersonalInfo from '../components/EditEnterprise/EditPersonalInfo.jsx';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS } from '../config/constants.js';
import PersonalInfoForm from '../components/EditEnterprise/PersonalInfoForm';
import PictureUpload from '../components/EditEnterprise/PictureUpload';
import FormActions from '../components/EditEnterprise/FormActions';
import SnackbarManager from '../components/EditEnterprise/SnackbarManager';
import ServiceTable from '../components/EditEnterprise/Service/ServiceTable.tsx';
import EmployeeTable from '../components/EditEnterprise/Employee/EmployeeTable.tsx';

const EditEnterprisePage = () => {
  const [loading, setLoading] = useState(true);
  const [enterprise, setEnterprise] = useState({});
  const [snackPack, setSnackPack] = useState([]);

  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  const loadEnterprise = async () => {
    const shop = await getShopByEmail(authCtx.email);
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
    await fetch(API_ENDPOINTS.ENTERPRISE_DETAIL(enterprise.id), {
      method: 'PUT',
      body: JSON.stringify(enterprise),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    handleSnackbarOpen(t('ENTERPRISE_CHANGES_SAVED'));
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

  const handleLogoUpload = (event) => {
    setEnterprise({
      ...enterprise,
      logo: event.target.files[0],
    });
  };

  const handlePicturesUpload = (event) => {
    setEnterprise({
      ...enterprise,
      pictures: Array.from(event.target.files),
    });
  };

  const handleDeletePicture = (deletedName) => {
    const newPictures = enterprise.pictures.filter((picture) => picture.name !== deletedName);
    setEnterprise({
      ...enterprise,
      pictures: newPictures,
    });
  };

  const handleSnackbarOpen = (message) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  return (
    <>
      {!loading && (
        <>
          {enterprise.logo && (
            <Box
              sx={{
                backgroundSize: 'cover',
                backgroundImage: `url(${URL.createObjectURL(enterprise.logo)})`,
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

              <FormActions onReset={resetEnterprise} onSave={saveEnterprise} />
            </Paper>

            <EditPersonalInfo onLoadingUser={loadUser} onOpenSnackBar={handleSnackbarOpen} />
          </Box>

          <SnackbarManager snackPack={snackPack} />
        </>
      )}
    </>
  );
};

export default EditEnterprisePage;
