import React from 'react';
import { Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useTranslation } from 'react-i18next';

interface Requirement {
  key: string;
  test: (pw: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { key: 'PASS_REQ_LENGTH', test: (pw) => pw.length >= 8 },
  { key: 'PASS_REQ_UPPERCASE', test: (pw) => /[A-Z]/.test(pw) },
  { key: 'PASS_REQ_LOWERCASE', test: (pw) => /[a-z]/.test(pw) },
  { key: 'PASS_REQ_NUMBER', test: (pw) => /\d/.test(pw) },
  { key: 'PASS_REQ_SPECIAL', test: (pw) => /[@$!%*?&]/.test(pw) },
];

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const { t } = useTranslation();

  return (
    <Stack gap={0.5} mt={0.5}>
      {REQUIREMENTS.map(({ key, test }) => {
        const met = password.length > 0 && test(password);
        return (
          <Stack key={key} direction="row" alignItems="center" gap={0.75}>
            {met ? (
              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            )}
            <Typography variant="caption" sx={{ color: met ? 'success.main' : 'text.secondary', transition: 'color 0.2s' }}>
              {t(key)}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default PasswordRequirements;
