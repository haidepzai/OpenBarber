// @ts-nocheck
import React, { useContext, useState } from 'react';
import { Rating, Box, Typography, IconButton, TextField, Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../context/auth-context';
import { updateReview, deleteReview } from '../../actions/ReviewActions';

const AVATAR_URL = 'https://www.shareicon.net/data/2016/09/15/829473_man_512x512.png';

const ShopReview = ({ review, onUpdated, onDeleted }) => {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);
  const currentUserId = authCtx.user?.id;
  const isOwner = currentUserId && review.reviewerId === currentUserId;

  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const avatarSrc = review.authorPhoto ? `data:image/jpeg;base64,${review.authorPhoto}` : AVATAR_URL;

  const handleSaveEdit = async () => {
    await updateReview(review.id, { comment: editComment, rating: editRating });
    setIsEditing(false);
    if (onUpdated) onUpdated();
  };

  const handleDelete = async () => {
    await deleteReview(review.id);
    setConfirmDelete(false);
    if (onDeleted) onDeleted();
  };

  return (
    <Box sx={{ display: 'flex', gap: 4, borderBottom: 1, borderColor: 'divider', pb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Box
          boxShadow={2}
          sx={{ width: '5rem', height: '5rem', borderRadius: '50%', backgroundImage: `url(${avatarSrc})`, backgroundSize: 'cover' }}
        />
        <Rating
          readOnly={isEditing ? false : true}
          precision={0.5}
          value={isEditing ? editRating : review.rating}
          onChange={(_, v) => setEditRating(v)}
          sx={{ color: 'primary.main' }}
          size="small"
        />
        <Typography variant="span" color="grey.400">
          {dayjs(review.createdAt).format('DD/MM/YYYY hh:mm A')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            <Typography variant="span" sx={{ fontWeight: 600 }}>
              {review.author}
            </Typography>
            &nbsp;{t('WROTE')}:
          </Typography>
          {isOwner && !isEditing && (
            <Box>
              <IconButton size="small" onClick={() => setIsEditing(true)} title={t('EDIT', 'Bearbeiten')}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => setConfirmDelete(true)} title={t('DELETE', 'Löschen')}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField multiline rows={3} value={editComment} onChange={(e) => setEditComment(e.target.value)} fullWidth />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" onClick={handleSaveEdit} disabled={editComment.trim().length === 0}>
                {t('SAVE', 'Speichern')}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setIsEditing(false);
                  setEditComment(review.comment);
                  setEditRating(review.rating);
                }}
              >
                {t('CANCEL', 'Abbrechen')}
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1">{review.comment}</Typography>
        )}
      </Box>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>{t('CONFIRM_DELETE_REVIEW', 'Bewertung wirklich löschen?')}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>{t('CANCEL', 'Abbrechen')}</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            {t('DELETE', 'Löschen')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShopReview;
