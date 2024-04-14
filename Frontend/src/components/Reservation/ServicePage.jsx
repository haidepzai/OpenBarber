import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

const ServicePage = ({ pickedServices, pickService, removeService, name, shopServices }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ padding: '20px', overflow: 'auto' }}>
      <Typography variant="h6" sx={{ marginBottom: '20px' }}>
        {name || 'Friseur XY Stuttgart'}
      </Typography>
      <Typography variant="overline" display="block" gutterBottom>
        {t('CHOOSE_SERVICE')}
      </Typography>
      {[...new Set(shopServices.map((obj) => obj.targetAudience))].map((targetAudience) => (
        <Accordion sx={{ marginBottom: '20px' }} key={targetAudience}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography sx={{ textTransform: 'capitalize' }}>{targetAudience}</Typography>
          </AccordionSummary>
          {shopServices
            .filter((service) => service.targetAudience === targetAudience)
            .map((service) => (
              <Stack
                key={service.title}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  borderTop: '0.5px solid rgb(236,236,236)',
                  padding: '16px',
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      textTransform: 'uppercase',
                      lineHeight: 'unset',
                      color: '#666',
                    }}
                  >
                    {service.targetAudience}
                  </Typography>
                  <Typography>{service.title}</Typography>
                </Box>
                <Stack direction="row" alignItems="center" gap="15px">
                  <Typography sx={{ lineHeight: 'unset' }}>{service.price} &#8364;</Typography>
                  {pickedServices.some((pickedService) => pickedService === service) ? (
                    <Button type="button" sx={{ width: '105px', fontSize: '12px' }} variant="contained" onClick={() => removeService(service)}>
                      {t('SELECTED')}
                    </Button>
                  ) : (
                    <Button type="button" sx={{ width: '105px', fontSize: '12px' }} variant="outlined" onClick={() => pickService(service)}>
                      {t('SELECT')}
                    </Button>
                  )}
                </Stack>
              </Stack>
            ))}
        </Accordion>
      ))}
    </Box>
  );
};

export default ServicePage;
