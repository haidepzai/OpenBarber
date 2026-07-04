import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Divider, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTranslation } from 'react-i18next';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FaqPage = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | false>(false);

  const categories = [
    { label: t('FAQ_CAT_ALL'), value: 'all', icon: <HelpOutlineIcon fontSize="small" /> },
    { label: t('FAQ_CAT_BOOKING'), value: 'booking', icon: <CalendarMonthIcon fontSize="small" /> },
    { label: t('FAQ_CAT_SERVICES'), value: 'services', icon: <ContentCutIcon fontSize="small" /> },
    { label: t('FAQ_CAT_ACCOUNT'), value: 'account', icon: <AccountCircleIcon fontSize="small" /> },
    { label: t('FAQ_CAT_SHOP'), value: 'shop', icon: <StoreIcon fontSize="small" /> },
  ];

  const faqs: FaqItem[] = [
    { category: 'booking', question: t('FAQ_Q_BOOKING_1'), answer: t('FAQ_A_BOOKING_1') },
    { category: 'booking', question: t('FAQ_Q_BOOKING_2'), answer: t('FAQ_A_BOOKING_2') },
    { category: 'booking', question: t('FAQ_Q_BOOKING_3'), answer: t('FAQ_A_BOOKING_3') },
    { category: 'booking', question: t('FAQ_Q_BOOKING_4'), answer: t('FAQ_A_BOOKING_4') },
    { category: 'booking', question: t('FAQ_Q_BOOKING_5'), answer: t('FAQ_A_BOOKING_5') },
    { category: 'services', question: t('FAQ_Q_SERVICES_1'), answer: t('FAQ_A_SERVICES_1') },
    { category: 'services', question: t('FAQ_Q_SERVICES_2'), answer: t('FAQ_A_SERVICES_2') },
    { category: 'services', question: t('FAQ_Q_SERVICES_3'), answer: t('FAQ_A_SERVICES_3') },
    { category: 'account', question: t('FAQ_Q_ACCOUNT_1'), answer: t('FAQ_A_ACCOUNT_1') },
    { category: 'account', question: t('FAQ_Q_ACCOUNT_2'), answer: t('FAQ_A_ACCOUNT_2') },
    { category: 'account', question: t('FAQ_Q_ACCOUNT_3'), answer: t('FAQ_A_ACCOUNT_3') },
    { category: 'account', question: t('FAQ_Q_ACCOUNT_4'), answer: t('FAQ_A_ACCOUNT_4') },
    { category: 'shop', question: t('FAQ_Q_SHOP_1'), answer: t('FAQ_A_SHOP_1') },
    { category: 'shop', question: t('FAQ_Q_SHOP_2'), answer: t('FAQ_A_SHOP_2') },
    { category: 'shop', question: t('FAQ_Q_SHOP_3'), answer: t('FAQ_A_SHOP_3') },
    { category: 'shop', question: t('FAQ_Q_SHOP_4'), answer: t('FAQ_A_SHOP_4') },
  ];

  const filtered = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      search.trim() === '' || faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6D5344 0%, #8a6a58 100%)',
          py: { xs: 6, md: 10 },
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight={700} sx={{ color: 'white', mb: 1, fontSize: { xs: '2rem', md: '2.75rem' } }}>
          {t('FAQ_TITLE')}
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', mb: 4, fontWeight: 400 }}>
          {t('FAQ_SUBTITLE')}
        </Typography>
        <Box sx={{ maxWidth: 520, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder={t('FAQ_SEARCH_PLACEHOLDER')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(0,0,0,0.4)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& fieldset': { border: 'none' },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ maxWidth: 820, mx: 'auto', px: { xs: 2, md: 4 }, py: 6 }}>
        {/* Category chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 4, justifyContent: 'center' }}>
          {categories.map((cat) => (
            <Chip
              key={cat.value}
              label={cat.label}
              icon={cat.icon}
              onClick={() => setActiveCategory(cat.value)}
              color={activeCategory === cat.value ? 'primary' : 'default'}
              variant={activeCategory === cat.value ? 'filled' : 'outlined'}
              sx={{ fontWeight: activeCategory === cat.value ? 600 : 400 }}
            />
          ))}
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {/* Result count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filtered.length} {filtered.length === 1 ? t('FAQ_RESULTS_COUNT_ONE') : t('FAQ_RESULTS_COUNT_OTHER')}
        </Typography>

        {/* Accordion list */}
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <HelpOutlineIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {t('FAQ_NO_RESULTS_TITLE')}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('FAQ_NO_RESULTS_SUBTITLE')}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            {filtered.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel-${index}`}
                onChange={handleChange(`panel-${index}`)}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: expanded === `panel-${index}` ? 'primary.main' : 'divider',
                  borderRadius: '8px !important',
                  '&:before': { display: 'none' },
                  transition: 'border-color 0.2s',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    px: 3,
                    py: 0.5,
                    '& .MuiAccordionSummary-content': { my: 1.5 },
                    backgroundColor: expanded === `panel-${index}` ? 'rgba(109,83,68,0.05)' : 'transparent',
                    borderRadius: '8px',
                  }}
                >
                  <Typography fontWeight={600}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}

        {/* Contact CTA */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(109,83,68,0.06)',
            textAlign: 'center',
            border: '1px solid rgba(109,83,68,0.15)',
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1.5 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {t('FAQ_CONTACT_TITLE')}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {t('FAQ_CONTACT_SUBTITLE')}
          </Typography>
          <Typography
            component="a"
            href="mailto:haidepzai.solutions@gmail.com"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            haidepzai.solutions@gmail.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FaqPage;
