import React, {useRef, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReCAPTCHA from 'react-google-recaptcha';
import {useTranslation} from 'react-i18next';
import {useForm} from '@formspree/react';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;
const FORMSPREE_ID = 'xdaryppk';

const ContactPage = () => {
    const {t} = useTranslation();
    const [state, handleSubmit] = useForm(FORMSPREE_ID);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaError, setCaptchaError] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const infoItems = [
        {
            icon: <EmailIcon/>,
            label: t('CONTACT_INFO_EMAIL'),
            value: 'haidepzai.solutions@gmail.com',
            href: 'mailto:haidepzai.solutions@gmail.com'
        },
        {icon: <AccessTimeIcon/>, label: t('CONTACT_INFO_RESPONSE'), value: t('CONTACT_INFO_RESPONSE_VALUE')},
        {icon: <LocationOnIcon/>, label: t('CONTACT_INFO_LOCATION'), value: t('CONTACT_INFO_LOCATION_VALUE')},
    ];

    const validate = (data: FormData) => {
        const errors: Record<string, string> = {};
        if (!data.get('name')) errors.name = t('CONTACT_REQUIRED');
        const email = data.get('email') as string;
        if (!email) errors.email = t('CONTACT_REQUIRED');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t('CONTACT_EMAIL_INVALID');
        if (!data.get('message')) errors.message = t('CONTACT_REQUIRED');
        return errors;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const errors = validate(data);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;
        if (!captchaToken) {
            setCaptchaError(true);
            return;
        }
        setCaptchaError(false);
        await handleSubmit(e);
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
    };

    if (state.succeeded) {
        return (
            <Box sx={{maxWidth: 520, mx: 'auto', px: 3, py: 12, textAlign: 'center'}}>
                <CheckCircleOutlineIcon sx={{fontSize: 72, color: 'primary.main', mb: 2}}/>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    {t('CONTACT_SUCCESS_TITLE')}
                </Typography>
                <Typography color="text.secondary" mb={4}>
                    {t('CONTACT_SUCCESS_SUBTITLE')}
                </Typography>
                <Button variant="outlined" color="primary" onClick={() => window.location.reload()}>
                    {t('CONTACT_SEND_ANOTHER')}
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {/* Hero */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #6D5344 0%, #8a6a58 100%)',
                    py: {xs: 6, md: 9},
                    px: 3,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h3" fontWeight={700}
                            sx={{color: '#fff', mb: 1, fontSize: {xs: '2rem', md: '2.75rem'}}}>
                  {t('CONTACT_TITLE')}
                </Typography>
                <Typography variant="h6" sx={{color: 'rgba(255,255,255,0.75)', fontWeight: 400}}>
                    {t('CONTACT_SUBTITLE')}
                </Typography>
            </Box>

            <Box sx={{maxWidth: 960, mx: 'auto', px: {xs: 2, md: 4}, py: 6}}>
                <Stack direction={{xs: 'column', md: 'row'}} spacing={4} alignItems="flex-start">
                    {/* Form */}
                    <Box flex={2}>
                        <Paper elevation={0} variant="outlined" sx={{p: {xs: 3, md: 4}, borderRadius: 3}}>
                            <form onSubmit={onSubmit} noValidate>
                                <Stack spacing={3}>
                                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                                        <TextField
                                            name="name"
                                            label={t('CONTACT_NAME')}
                                            required
                                            fullWidth
                                            error={!!fieldErrors.name}
                                            helperText={fieldErrors.name}
                                        />
                                        <TextField
                                            name="email"
                                            label={t('CONTACT_EMAIL')}
                                            type="email"
                                            required
                                            fullWidth
                                            error={!!fieldErrors.email}
                                            helperText={fieldErrors.email}
                                        />
                                    </Stack>

                                    <TextField
                                        name="subject"
                                        label={t('CONTACT_SUBJECT')}
                                        select
                                        fullWidth
                                        defaultValue="general"
                                    >
                                        <MenuItem value="general">{t('CONTACT_SUBJECT_GENERAL')}</MenuItem>
                                        <MenuItem value="bug">{t('CONTACT_SUBJECT_BUG')}</MenuItem>
                                        <MenuItem value="shop">{t('CONTACT_SUBJECT_SHOP')}</MenuItem>
                                        <MenuItem value="other">{t('CONTACT_SUBJECT_OTHER')}</MenuItem>
                                    </TextField>

                                    <TextField
                                        name="message"
                                        label={t('CONTACT_MESSAGE')}
                                        multiline
                                        rows={5}
                                        required
                                        fullWidth
                                        error={!!fieldErrors.message}
                                        helperText={fieldErrors.message}
                                    />

                                    <Box>
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={RECAPTCHA_SITE_KEY}
                                            onChange={(token) => {
                                                setCaptchaToken(token);
                                                setCaptchaError(false);
                                            }}
                                            onExpired={() => setCaptchaToken(null)}
                                        />
                                        {captchaError && (
                                            <Typography variant="caption" color="error"
                                                        sx={{mt: 0.5, display: 'block'}}>
                                                {t('CONTACT_CAPTCHA_REQUIRED')}
                                            </Typography>
                                        )}
                                    </Box>

                                    {state.errors && Object.keys(state.errors).length > 0 && (
                                        <Alert severity="error">{t('CONTACT_ERROR')}</Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        endIcon={state.submitting ? <CircularProgress size={18} color="inherit"/> :
                                            <SendIcon/>}
                                        disabled={state.submitting}
                                        sx={{alignSelf: 'flex-start', px: 4}}
                                    >
                                        {state.submitting ? t('CONTACT_SENDING') : t('CONTACT_SEND')}
                                    </Button>
                                </Stack>
                            </form>
                        </Paper>
                    </Box>

                    {/* Info sidebar */}
                    <Box flex={1} sx={{minWidth: {md: 240}}}>
                        <Paper elevation={0} variant="outlined" sx={{p: 3, borderRadius: 3}}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                {t('CONTACT_INFO_TITLE')}
                            </Typography>
                            <Divider sx={{mb: 2}}/>
                            <Stack spacing={2.5}>
                                {infoItems.map((item, i) => (
                                    <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                                        <Box sx={{color: 'primary.main', mt: 0.2}}>{item.icon}</Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                {item.label}
                                            </Typography>
                                            {item.href ? (
                                                <Typography
                                                    component="a"
                                                    href={item.href}
                                                    variant="body2"
                                                    fontWeight={500}
                                                    sx={{
                                                        color: 'primary.main',
                                                        textDecoration: 'none',
                                                        '&:hover': {textDecoration: 'underline'}
                                                    }}
                                                >
                                                    {item.value}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" fontWeight={500}>
                                                    {item.value}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                ))}
                            </Stack>
                        </Paper>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default ContactPage;
