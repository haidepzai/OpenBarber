// @ts-nocheck
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Rating,
  IconButton,
} from '@mui/material';
import React from 'react';
import StoreIcon from '@mui/icons-material/Store';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Delete, Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { reviewsAPI } from '../../api/apiClient';

const ReviewList = ({ reviews = [], loading, onRefetch }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [editingReview, setEditingReview] = React.useState(null);
  const [editingPhotoFile, setEditingPhotoFile] = React.useState(null);
  const [editingPhotoPreview, setEditingPhotoPreview] = React.useState(null);
  const [removeEditingPhoto, setRemoveEditingPhoto] = React.useState(false);
  const [deletingReview, setDeletingReview] = React.useState(null);
  const [savingReview, setSavingReview] = React.useState(false);

  const getReviewPhotoSrc = (photo) => (photo ? `data:image/jpeg;base64,${photo}` : null);

  const resetEditingPhotoState = () => {
    if (editingPhotoPreview) {
      URL.revokeObjectURL(editingPhotoPreview);
    }
    setEditingPhotoFile(null);
    setEditingPhotoPreview(null);
    setRemoveEditingPhoto(false);
  };

  const closeEditDialog = () => {
    resetEditingPhotoState();
    setEditingReview(null);
  };

  const openEditDialog = (review) => {
    resetEditingPhotoState();
    setEditingReview({ id: review.id, comment: review.comment, rating: review.rating, reviewPhotoData: review.reviewPhotoData });
  };

  const handleEditPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (editingPhotoPreview) {
      URL.revokeObjectURL(editingPhotoPreview);
    }
    setEditingPhotoFile(file);
    setEditingPhotoPreview(URL.createObjectURL(file));
    setRemoveEditingPhoto(false);
  };

  const handleRemoveEditPhoto = () => {
    resetEditingPhotoState();
    setRemoveEditingPhoto(Boolean(editingReview?.reviewPhotoData));
  };

  const handleSaveReview = async () => {
    if (!editingReview) return;
    setSavingReview(true);
    try {
      await reviewsAPI.update(editingReview.id, { comment: editingReview.comment, rating: editingReview.rating });
      if (removeEditingPhoto && editingReview.reviewPhotoData) {
        await reviewsAPI.deletePhoto(editingReview.id);
      }
      if (editingPhotoFile) {
        await reviewsAPI.uploadPhoto(editingReview.id, editingPhotoFile);
      }
      await onRefetch();
      closeEditDialog();
    } catch (error) {
      console.error('Update review failed', error);
    } finally {
      setSavingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!deletingReview) return;
    try {
      await reviewsAPI.delete(deletingReview.id);
      await onRefetch();
      setDeletingReview(null);
    } catch (error) {
      console.error('Delete review failed', error);
    }
  };

  const renderReviewCard = (review) => (
    <Paper
      key={review.id}
      elevation={2}
      onClick={() => review.shopId && navigate(`/shops/${review.shopId}`)}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        cursor: review.shopId ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, transform 0.15s',
        '&:hover': review.shopId ? { boxShadow: 6, transform: 'translateY(-2px)' } : {},
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'flex-start' }} gap={2}>
        <Stack gap={1} flex={1} minWidth={0}>
          {review.shopName && (
            <Stack direction="row" alignItems="center" gap={1}>
              <StoreIcon fontSize="small" color="action" />
              <Typography variant="body2" fontWeight={600}>
                {review.shopName}
              </Typography>
            </Stack>
          )}
          <Rating value={review.rating} readOnly precision={0.5} size="small" sx={{ color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            {review.comment}
          </Typography>
          {review.reviewPhotoData && (
            <Box
              component="img"
              src={getReviewPhotoSrc(review.reviewPhotoData)}
              alt={t('REVIEW_PHOTO')}
              sx={{ width: { xs: '100%', sm: 96 }, maxWidth: 220, height: 96, objectFit: 'cover', borderRadius: 2 }}
            />
          )}
          <Typography variant="caption" color="text.disabled">
            {new Date(review.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </Typography>
        </Stack>
        <Stack direction="row" gap={0.5} justifyContent="flex-end">
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              openEditDialog(review);
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(event) => {
              event.stopPropagation();
              setDeletingReview(review);
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <>
      <Stack direction="row" alignItems="center" gap={1} mb={2}>
        <RateReviewIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          {t('MY_REVIEWS', 'Meine Bewertungen')}
        </Typography>
      </Stack>
      {loading ? (
        <Stack alignItems="center" mt={2}>
          <CircularProgress size={24} />
        </Stack>
      ) : reviews.length === 0 ? (
        <Typography color="text.secondary">{t('NO_REVIEWS', 'Noch keine Bewertungen abgegeben.')}</Typography>
      ) : (
        <Stack gap={2}>{reviews.map(renderReviewCard)}</Stack>
      )}

      <Dialog open={!!editingReview} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('EDIT_REVIEW', 'Bewertung bearbeiten')}</DialogTitle>
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Rating
            value={editingReview?.rating ?? 0}
            onChange={(_, value) => setEditingReview((review) => ({ ...review, rating: value }))}
            sx={{ color: 'primary.main' }}
          />
          <TextField
            multiline
            rows={4}
            fullWidth
            value={editingReview?.comment ?? ''}
            onChange={(event) => setEditingReview((review) => ({ ...review, comment: event.target.value }))}
          />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button component="label" variant="outlined">
              {t(editingPhotoPreview || (!removeEditingPhoto && editingReview?.reviewPhotoData) ? 'CHANGE_PHOTO' : 'ADD_PHOTO')}
              <input hidden type="file" accept="image/*" onChange={handleEditPhotoChange} />
            </Button>
            {(editingPhotoPreview || (!removeEditingPhoto && editingReview?.reviewPhotoData)) && (
              <>
                <Box
                  component="img"
                  src={editingPhotoPreview || getReviewPhotoSrc(editingReview?.reviewPhotoData)}
                  alt={t('REVIEW_PHOTO')}
                  sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 2 }}
                />
                <Button color="error" onClick={handleRemoveEditPhoto}>
                  {t('REMOVE_PHOTO')}
                </Button>
              </>
            )}
          </Box>
        </Box>
        <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 1, px: { xs: 2, sm: 3 }, pb: 2 }}>
          <Button onClick={closeEditDialog} fullWidth={!!editingReview} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {t('CANCEL', 'Abbrechen')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveReview}
            disabled={savingReview || !editingReview?.comment?.trim()}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {savingReview ? <CircularProgress size={18} /> : t('SAVE', 'Speichern')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deletingReview} onClose={() => setDeletingReview(null)}>
        <DialogTitle>{t('CONFIRM_DELETE_REVIEW', 'Bewertung wirklich löschen?')}</DialogTitle>
        <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 1, px: 2, pb: 2 }}>
          <Button onClick={() => setDeletingReview(null)} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {t('CANCEL', 'Abbrechen')}
          </Button>
          <Button color="error" variant="contained" onClick={handleDeleteReview} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {t('DELETE', 'Löschen')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewList;
