import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

const DeleteServicesDialog = ({ open, setOpen, numSelected, setSelected, deleteServices }) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      {numSelected >= 2 ? (
        <DialogTitle id="alert-dialog-title">{t('DELETE_SERVICES', {numSelected: numSelected})}</DialogTitle>
      ) : (
        <DialogTitle id="alert-dialog-title">{t('DELETE_SERVICE')}</DialogTitle>
      )}

      {/*<DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContentText>
            </DialogContent>*/}
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
            deleteServices();
            setSelected([]);
          }}
        >
          {t('DELETE')}
        </Button>
        <Button onClick={handleClose} autoFocus>
        {t('CANCEL')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteServicesDialog;
