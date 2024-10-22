import React from 'react';
import { Stack, Typography, ThemeProvider, Button, IconButton } from '@mui/material';
import image from '../assets/logo_openbarber.svg';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { footerTheme } from '../themes/footerTheme';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../css/Footer.css';

function Footer() {
  const { t } = useTranslation();

  return (
    <ThemeProvider theme={footerTheme}>
      <Stack direction="row" justifyContent="space-between" sx={{ backgroundColor: '#6D5344', p: '36px 48px', mt: '96px' }}>
        <Stack direction="column" gap={2}>
          <Stack direction="row" gap={2} alignItems="center">
            <img src={image} alt="OpenBarber-Logo" width={'25px'} style={{ filter: 'brightness(0) invert(1)' }} />
            <Typography variant="h5" sx={{ color: 'white.main' }}>
              OpenBarber
            </Typography>
          </Stack>
          <Stack direction="row" gap={3}>
            <Link to="#" className="link">
              {t('IMPRINT')}
            </Link>
            <Link to="/privacy-policy" className="link">
              {t('DATA_PRIVACY')}
            </Link>
            <Link to="#" className="link">
              {t('TERMS_OF_USE')}
            </Link>
            <Link to="#" className="link">
              {t('CONTACT')}
            </Link>
            <Link to="#" className="link">
              FAQs
            </Link>
          </Stack>
          <Typography variant="p" sx={{ color: '#BCA7AF' }}>
            Copyright © {new Date().getFullYear()} OpenBarber, Nobelstraße 10, 70569 Stuttgart, {t('ALL_RIGHTS_RESERVED')}
          </Typography>
        </Stack>
        <Stack direction="column" gap={3}>
          <Button variant="contained" color="white" sx={{ color: '#6D5344' }}>
            {t('FOR_ENTERPRISES')}
          </Button>
          <Stack direction="row" gap={1}>
            <IconButton aria-label="delete" color="lol">
              <InstagramIcon fontSize="inherit" />
            </IconButton>
            <IconButton aria-label="delete">
              <TwitterIcon />
            </IconButton>
            <IconButton aria-label="delete">
              <FacebookIcon />
            </IconButton>
            <IconButton aria-label="delete">
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}

export default Footer;
