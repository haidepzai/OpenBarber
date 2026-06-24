// @ts-nocheck
import React, { Fragment, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';

import { Box, IconButton, Stepper, Step, StepButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SignUpStep from './components/SignUpStep';
import ShopCreateStep from './components/ShopCreateStep';
import AwaitingApprovalStep from './components/AwaitingApprovalStep';
import EmailVerificationStep from './components/EmailVerificationStep';
import RoleSelectStep from './components/RoleSelectStep';
import { SignupContext } from '../../context/Signup.context';
import AuthContext from '../../context/auth-context';

const shopSteps = ['Select role', 'Sign up', 'Sign up your shop', 'Verify your E-Mail', 'Wait for Approval'];
const customerSteps = ['Select role', 'Sign up', 'Verify your E-Mail'];

const SignupModal = () => {
  const portalElement = document.getElementById('overlays');
  const signUpCtx = useContext(SignupContext);
  const authCtx = useContext(AuthContext);

  const accountType = signUpCtx.data?.accountType;
  const steps = accountType === 'customer' ? customerSteps : shopSteps;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const cb = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', cb);
    return () => document.removeEventListener('keydown', cb);
  }, [authCtx, signUpCtx]);

  const handleClose = () => {
    authCtx.onLogout();
    signUpCtx.setSignupVisible(false);
    document.body.style.overflow = '';
  };

  const renderStep = () => {
    const step = signUpCtx.activeStep;
    if (step === 0) return <RoleSelectStep />;
    if (step === 1) return <SignUpStep />;
    if (accountType === 'customer') {
      if (step === 2) return <EmailVerificationStep />;
    } else {
      if (step === 2) return <ShopCreateStep />;
      if (step === 3) return <EmailVerificationStep />;
      if (step === 4) return <AwaitingApprovalStep />;
    }
    return null;
  };

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 50,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 'min(860px, 95%)',
              maxHeight: '92vh',
              backgroundColor: 'background.default',
              borderRadius: 4,
              boxShadow: 10,
              padding: { xs: 3, sm: 4 },
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Stepper nonLinear activeStep={signUpCtx.activeStep} sx={{ flex: 1, '& .MuiStepLabel-label': { fontSize: '0.75rem' } }}>
                {steps.map((label, index) => (
                  <Step key={label} completed={signUpCtx.completedSteps[index]}>
                    <StepButton type="button" onClick={() => signUpCtx.setActiveStep(index)} disabled={true}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
              <IconButton onClick={handleClose} sx={{ ml: 2 }} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            <Stack flexGrow="1" sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {renderStep()}
            </Stack>
          </Box>
        </Box>,
        portalElement
      )}
    </Fragment>
  );
};

export default SignupModal;
