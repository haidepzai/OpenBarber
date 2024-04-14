import React, { Fragment, useContext, useEffect, useReducer, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import ServicePage from './ServicePage';
import DatePage from './DatePage';
import OverviewPage from './OverviewPage';
import SuccessScreen from './SuccessScreen';
import { createAppointment } from '../../actions/AppointmentActions';
import AuthContext from '../../context/auth-context';
import { useTranslation } from 'react-i18next';

const steps = ['Services', 'Date', 'Booking'];

const initialState = {
  enterpriseId: '',
  services: [],
  employee: { name: 'Any' },
  employeeId: '',
  appointmentDateTime: new Date(),
  personalData: {
    formOfAddress: 'None',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  },
  note: '',
  paymentMethod: 'ON_SITE_CASH',
};

const initialErrorState = {
  0: '', //Service
  1: '', //Date
  2: '', //Personal Info
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set_services':
      return { ...state, services: [...state.services, action.payload] };
    case 'remove_service':
      return { ...state, services: state.services.filter((service) => service !== action.payload) };
    case 'set_employee':
      return { ...state, employee: action.payload, employeeId: action.payload.id };
    case 'set_date':
      return { ...state, appointmentDateTime: action.payload };
    case 'set_personal_data':
      return { ...state, personalData: { ...state.personalData, ...action.payload } };
    case 'set_enterprise_id':
      return { ...state, enterpriseId: action.payload };
    case 'set_payment_method':
      return { ...state, paymentMethod: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

function ReservationDialog({ open, handleClose, shop }) {
  const [data, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState(initialErrorState);
  const [activeStep, setActiveStep] = useState(0);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const { t } = useTranslation();

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    dispatch({ type: 'set_enterprise_id', payload: shop.id });
  }, [shop.id]);

  const validate = (step) => {
    switch (step) {
      case 0:
        return data.services.length > 0;
      case 1:
        return !!data.appointmentDateTime;
      case 2:
        return !Object.values(data.personalData).map(Boolean).includes(false);
      default:
        console.log('rip');
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !validate(0)) {
      setError({
        ...error,
        0: t('CHOOSE_SERVICE'),
      });
    } else if (activeStep === 1 && !validate(1)) {
      setError({
        ...error,
        1: t('PICK_DATE'),
      });
    } else if (activeStep === 2 && !validate(2)) {
      setError({
        ...error,
        2: t('CHECK_INFORMATION'),
      });
    } else {
      if (activeStep === 2) {
        handleSubmit();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleSubmit = async () => {
    authCtx.setIsLoading(true);
    const isoDateTime = data.appointmentDateTime.toISOString();
    const requestObject = {
      customerName: `${data.personalData.firstName} ${data.personalData.lastName}`,
      customerPhoneNumber: data.personalData.phoneNumber,
      customerEmail: data.personalData.email,
      appointmentDateTime: isoDateTime,
      enterpriseId: shop.id,
      employee: data.employee,
      employeeId: data.employee.id,
      services: data.services,
      paymentMethod: data.paymentMethod,
    };
    console.log(requestObject);
    try {
      let res = await createAppointment(requestObject, shop.id);
      setShowSuccessScreen(true);
      console.log(res);
    } catch (error) {
      console.log('Could not book');
    }
    authCtx.setIsLoading(false);
  };

  const handleStep = (step) => {
    setActiveStep(step);
  };

  const pickService = (newService) => {
    dispatch({ type: 'set_services', payload: newService });
    // Reset error
    if (error[0]) {
      setError({
        ...error,
        0: '',
      });
    }
  };

  const removeService = (oldService) => {
    dispatch({ type: 'remove_service', payload: oldService });
  };

  const pickStylist = (employee) => {
    dispatch({ type: 'set_employee', payload: employee });
  };

  const pickDate = (date) => {
    const realDate = new Date(date);
    dispatch({ type: 'set_date', payload: realDate });
    if (error[1]) {
      setError({
        ...error,
        1: '',
      });
    }
  };

  const prevNotDone = (index) => {
    if (index === 1) {
      return !validate(0);
    } else if (index === 2) {
      return !validate(0) || !validate(1);
    } else {
      return false;
    }
  };

  return (
    <Dialog fullWidth={true} maxWidth={'sm'} open={open} onClose={handleClose}>
      {showSuccessScreen ? (
        <SuccessScreen data={data} onClose={handleClose} />
      ) : (
        <Box sx={{ height: '80vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box
            sx={{
              padding: '20px 15px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
              zIndex: '1',
              backgroundColor: 'white',
            }}
          >
            <Stepper nonLinear activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label} completed={validate(index)}>
                  <StepButton
                    type="button"
                    onClick={() => handleStep(index)}
                    sx={{ '& .MuiSvgIcon-root': { color: prevNotDone(index) ? 'rgba(0, 0, 0, 0.1)' : 'default' } }}
                    disabled={prevNotDone(index)}
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Box>

          {activeStep === 0 && (
            <ServicePage
              pickedServices={data.services}
              pickService={pickService}
              removeService={removeService}
              name={shop.name}
              shopServices={shop.services}
            />
          )}

          {activeStep === 1 && (
            <DatePage
              pickedStylist={data.employee}
              pickStylist={pickStylist}
              pickedDate={data.appointmentDateTime}
              pickDate={pickDate}
              shopEmployees={shop.employees}
            />
          )}

          {activeStep === 2 && (
            <Fragment>
              {authCtx.isLoading && (
                <Stack alignItems="center" justifyContent="center" flexGrow="1">
                  <CircularProgress />
                </Stack>
              )}
              {!authCtx.isLoading && (
                <OverviewPage
                  data={data}
                  dispatch={dispatch}
                  handleStep={handleStep}
                  showErrors={!!error[2]}
                  noneEmpty={validate(2)}
                  error={error}
                  setError={setError}
                  shopPaymentMethods={shop.paymentMethods}
                />
              )}
            </Fragment>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px',
              borderTop: '1px solid rgba(0, 0, 0, 0.3)',
              boxShadow: '0 -3px 10px rgba(0, 0, 0, 0.3)',
              zIndex: '1',
            }}
          >
            <Button variant="outlined" type="button" onClick={handleClose}>
              {t('CLOSE')}
            </Button>
            {error[activeStep] && (
              <Typography
                variant="body1"
                sx={{ backgroundColor: 'error.dark', borderRadius: '40px', fontSize: '14px', color: 'white.main', padding: '5px 20px' }}
              >
                {error[activeStep]}
              </Typography>
            )}
            <Button variant={error[activeStep] ? 'outlined' : 'contained'} type="button" onClick={handleNext}>
              {activeStep === 2 ? `${t('BOOK_NOW')}` : `${t('NEXT')}`}
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}

export default ReservationDialog;
