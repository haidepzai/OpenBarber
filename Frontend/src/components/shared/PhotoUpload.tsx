import React, { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PhotoUploadProps {
  /** Current preview URL (object URL or base64 data URI) — null means no photo */
  previewSrc: string | null;
  /** Called when user picks a new file */
  onFileChange: (file: File, previewUrl: string) => void;
  /** Called when user removes the photo */
  onRemove: () => void;
  size?: number;
  buttonSize?: 'small' | 'medium' | 'large';
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  previewSrc,
  onFileChange,
  onRemove,
  size = 96,
  buttonSize = 'medium',
}) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onFileChange(file, url);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button component="label" variant="outlined" size={buttonSize}>
        {t(previewSrc ? 'CHANGE_PHOTO' : 'ADD_PHOTO')}
        <input hidden type="file" accept="image/*" onChange={handleChange} />
      </Button>
      {previewSrc && (
        <>
          <Box
            component="img"
            src={previewSrc}
            alt={t('REVIEW_PHOTO')}
            sx={{ width: size, height: size, objectFit: 'cover', borderRadius: 2 }}
          />
          <Button color="error" size={buttonSize} onClick={onRemove}>
            {t('REMOVE_PHOTO')}
          </Button>
        </>
      )}
    </Box>
  );
};

export default PhotoUpload;
