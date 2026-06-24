import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Stack,
  CircularProgress,
  Paper,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  Rating,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth-context';
import { appointmentsAPI, reviewsAPI } from '../api/apiClient';

const CustomerProfilePage = () => {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null); // { id, comment, rating }
  const [editingPhotoFile, setEditingPhotoFile] = useState(null);
  const [editingPhotoPreview, setEditingPhotoPreview] = useState(null);
  const [removeEditingPhoto, setRemoveEditingPhoto] = useState(false);
  const [deletingReview, setDeletingReview] = useState(null);
  const [savingReview, setSavingReview] = useState(false);

  const load = async () => {
    try {
      const res = await appointmentsAPI.getMy();
      setAppointments(res.data?.content ?? []);
    } catch (e) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await reviewsAPI.getMy();
      setReviews(res.data?.content ?? []);
    } catch (e) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

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

  const handleCancel = async (a) => {
    if (!window.confirm(t('CONFIRM_CANCEL_APPOINTMENT', 'Termin wirklich absagen?'))) return;
    setCancelling(a.id);
    try {
      await appointmentsAPI.cancel(a.id, a.confirmationCode);
      await load();
    } catch (e) {
      console.error('Cancel failed', e);
    } finally {
      setCancelling(null);
    }
  };

  const formatDateTime = (dt) => {
    if (!dt) return '';
    return new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  };

  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.appointmentDateTime) >= now);
  const past = appointments.filter((a) => new Date(a.appointmentDateTime) < now);

  const renderCard = (a, allowCancel) => (
    <Paper
      key={a.id}
      elevation={2}
      onClick={() => a.shopId && navigate(`/shops/${a.shopId}`)}
      sx={{
        p: 3,
        borderRadius: 3,
        cursor: a.shopId ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, transform 0.15s',
        '&:hover': a.shopId ? { boxShadow: 6, transform: 'translateY(-2px)' } : {},
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Stack gap={1} flex={1}>
          {/* Date & time */}
          <Stack direction="row" alignItems="center" gap={1}>
            <EventIcon fontSize="small" color="primary" />
            <Typography variant="body1" fontWeight={600}>
              {formatDateTime(a.appointmentDateTime)}
            </Typography>
            {a.endDateTime && (
              <Typography variant="body2" color="text.secondary">
                – {new Date(a.endDateTime).toLocaleTimeString(undefined, { timeStyle: 'short' })}
              </Typography>
            )}
          </Stack>

          {/* Salon */}
          {a.shopName && (
            <Stack direction="row" alignItems="center" gap={1}>
              <StoreIcon fontSize="small" color="action" />
              <Typography variant="body2">{a.shopName}</Typography>
            </Stack>
          )}

          {/* Stylist */}
          {a.employeeName && (
            <Stack direction="row" alignItems="center" gap={1}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2">{a.employeeName}</Typography>
            </Stack>
          )}

          {/* Services */}
          {a.services?.length > 0 && (
            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {a.services.map((s) => (
                <Chip key={s.id} label={s.title} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
        </Stack>

        <Stack alignItems="flex-end" gap={1}>
          <Chip
            label={a.confirmed ? t('APPOINTMENT_CONFIRMED', 'Bestätigt') : t('PENDING', 'Ausstehend')}
            color={a.confirmed ? 'success' : 'warning'}
            size="small"
          />
          {allowCancel && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              disabled={cancelling === a.id}
              onClick={(e) => {
                e.stopPropagation();
                handleCancel(a);
              }}
            >
              {cancelling === a.id ? <CircularProgress size={16} /> : t('CANCEL_APPOINTMENT', 'Absagen')}
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );

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
      await loadReviews();
      closeEditDialog();
    } catch (e) {
      console.error('Update review failed', e);
    } finally {
      setSavingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!deletingReview) return;
    try {
      await reviewsAPI.delete(deletingReview.id);
      await loadReviews();
      setDeletingReview(null);
    } catch (e) {
      console.error('Delete review failed', e);
    }
  };

  const renderReviewCard = (r) => (
    <Paper
      key={r.id}
      elevation={2}
      onClick={() => r.shopId && navigate(`/shops/${r.shopId}`)}
      sx={{
        p: 3,
        borderRadius: 3,
        cursor: r.shopId ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, transform 0.15s',
        '&:hover': r.shopId ? { boxShadow: 6, transform: 'translateY(-2px)' } : {},
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Stack gap={1} flex={1}>
          {r.shopName && (
            <Stack direction="row" alignItems="center" gap={1}>
              <StoreIcon fontSize="small" color="action" />
              <Typography variant="body2" fontWeight={600}>
                {r.shopName}
              </Typography>
            </Stack>
          )}
          <Rating value={r.rating} readOnly precision={0.5} size="small" sx={{ color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            {r.comment}
          </Typography>
          {r.reviewPhotoData && (
            <Box
              component="img"
              src={getReviewPhotoSrc(r.reviewPhotoData)}
              alt={t('REVIEW_PHOTO')}
              sx={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 2 }}
            />
          )}
          <Typography variant="caption" color="text.disabled">
            {new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </Typography>
        </Stack>
        <Stack direction="row" gap={0.5}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              openEditDialog(r);
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingReview(r);
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ width: '60%', margin: '40px auto', minHeight: '60vh' }}>
      <Typography variant="h4" fontWeight={600} mb={1}>
        {t('MY_APPOINTMENTS', 'Meine Termine')}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        {authCtx.email}
      </Typography>

      {loading ? (
        <Stack alignItems="center" mt={8}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Typography variant="h6" fontWeight={600} mb={2}>
            {t('UPCOMING', 'Bevorstehend')}
          </Typography>
          {upcoming.length === 0 ? (
            <Typography color="text.secondary" mb={4}>
              {t('NO_UPCOMING_APPOINTMENTS', 'Keine bevorstehenden Termine.')}
            </Typography>
          ) : (
            <Stack gap={2} mb={4}>
              {upcoming.map((a) => renderCard(a, true))}
            </Stack>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={600} mb={2}>
            {t('PAST', 'Vergangen')}
          </Typography>
          {past.length === 0 ? (
            <Typography color="text.secondary">{t('NO_PAST_APPOINTMENTS', 'Keine vergangenen Termine.')}</Typography>
          ) : (
            <Stack gap={2}>{past.map((a) => renderCard(a, false))}</Stack>
          )}

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <RateReviewIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              {t('MY_REVIEWS', 'Meine Bewertungen')}
            </Typography>
          </Stack>
          {reviewsLoading ? (
            <Stack alignItems="center" mt={2}>
              <CircularProgress size={24} />
            </Stack>
          ) : reviews.length === 0 ? (
            <Typography color="text.secondary">{t('NO_REVIEWS', 'Noch keine Bewertungen abgegeben.')}</Typography>
          ) : (
            <Stack gap={2}>{reviews.map(renderReviewCard)}</Stack>
          )}
        </>
      )}

      {/* Edit Review Dialog */}
      <Dialog open={!!editingReview} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('EDIT_REVIEW', 'Bewertung bearbeiten')}</DialogTitle>
        <Box sx={{ px: 3, pb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Rating
            value={editingReview?.rating ?? 0}
            onChange={(_, v) => setEditingReview((r) => ({ ...r, rating: v }))}
            sx={{ color: 'primary.main' }}
          />
          <TextField
            multiline
            rows={4}
            fullWidth
            value={editingReview?.comment ?? ''}
            onChange={(e) => setEditingReview((r) => ({ ...r, comment: e.target.value }))}
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
        <DialogActions>
          <Button onClick={closeEditDialog}>{t('CANCEL', 'Abbrechen')}</Button>
          <Button variant="contained" onClick={handleSaveReview} disabled={savingReview || !editingReview?.comment?.trim()}>
            {savingReview ? <CircularProgress size={18} /> : t('SAVE', 'Speichern')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Review Confirm Dialog */}
      <Dialog open={!!deletingReview} onClose={() => setDeletingReview(null)}>
        <DialogTitle>{t('CONFIRM_DELETE_REVIEW', 'Bewertung wirklich löschen?')}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeletingReview(null)}>{t('CANCEL', 'Abbrechen')}</Button>
          <Button color="error" variant="contained" onClick={handleDeleteReview}>
            {t('DELETE', 'Löschen')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerProfilePage;
