// @ts-nocheck
import React, { useContext, useMemo, useState } from 'react';
import image from '../assets/logo_openbarber.svg';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { SignupContext } from '../context/Signup.context';
import AuthContext from '../context/auth-context';
import { useTranslation } from 'react-i18next';
import LanguagePicker from './LanguagePicker/LanguagePicker';
import { useTheme } from '@mui/material/styles';

const Header = () => {
  const signUpCtx = useContext(SignupContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = useMemo(() => {
    if (!authCtx.isLoggedIn) return [];

    if (authCtx.role === 'OPERATOR') {
      return [
        { label: t('MANAGE_APPOINTMENT'), path: '/scheduler' },
        { label: t('EDIT_PROFILE'), path: '/edit' },
      ];
    }

    if (authCtx.role === 'VERIFIED') {
      return [
        { label: t('MY_APPOINTMENTS'), path: '/my-appointments' },
        { label: t('EDIT_PROFILE'), path: '/my-profile' },
      ];
    }

    return [];
  }, [authCtx.isLoggedIn, authCtx.role, t]);

  function handleLogout() {
    authCtx.onLogout();
    authCtx.deleteJWTTokenFromStorage();
    setDrawerOpen(false);
    navigate('/');
  }

  const handleNavigate = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'grey.300', px: { xs: 2, sm: 3, md: '8%' }, py: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }} sx={{ minWidth: 0 }}>
          <Link to="/">
            <Box component="img" src={image} alt="logo" sx={{ width: { xs: 42, sm: 50 } }} />
          </Link>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h5" fontFamily="Roboto" fontWeight="500" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              OpenBarber
            </Typography>
          </Link>
        </Stack>

        {!isMobile && navItems.length > 0 && (
          <Stack direction="row" alignItems="center" spacing={{ md: 2, lg: 4 }} sx={{ flexGrow: 1, justifyContent: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                size="large"
                sx={{ whiteSpace: 'nowrap', '&:hover': { backgroundColor: '#fff' } }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        )}

        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
          {!isMobile && !authCtx.isLoggedIn && (
            <>
              <Button variant="contained" color="secondary" onClick={() => signUpCtx.setSignupVisible(true)}>
                {t('SIGN_UP')}
              </Button>
              <Button variant="contained" color="secondary" onClick={() => signUpCtx.setLoginVisible(true)}>
                {t('LOGIN')}
              </Button>
            </>
          )}

          {!isMobile && authCtx.isLoggedIn && (
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              {t('LOGOUT')}
            </Button>
          )}

          <LanguagePicker />

          {isMobile && (
            <IconButton aria-label="open navigation" onClick={() => setDrawerOpen(true)} edge="end">
              <MenuIcon />
            </IconButton>
          )}
        </Stack>
      </Stack>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: { xs: 280, sm: 320 }, p: 2 }} role="presentation">
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            OpenBarber
          </Typography>

          {navItems.length > 0 && (
            <>
              <List sx={{ py: 0 }}>
                {navItems.map((item) => (
                  <ListItemButton key={item.path} onClick={() => handleNavigate(item.path)}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          <Stack spacing={1.5}>
            {!authCtx.isLoggedIn && (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setDrawerOpen(false);
                    signUpCtx.setSignupVisible(true);
                  }}
                >
                  {t('SIGN_UP')}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setDrawerOpen(false);
                    signUpCtx.setLoginVisible(true);
                  }}
                >
                  {t('LOGIN')}
                </Button>
              </>
            )}

            {authCtx.isLoggedIn && (
              <Button fullWidth variant="contained" color="secondary" onClick={handleLogout}>
                {t('LOGOUT')}
              </Button>
            )}
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
