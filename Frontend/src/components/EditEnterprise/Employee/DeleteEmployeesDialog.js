import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

const DeleteEmployeesDialog = ({ open, setOpen, numSelected, setSelected, deleteEmployees }) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      {numSelected >= 2 ? (
        <DialogTitle id="alert-dialog-title">{t('DELETE_EMPLOYEES', {numSelected: numSelected})}</DialogTitle>
      ) : (
        <DialogTitle id="alert-dialog-title">{t('DELETE_EMPLOYEE')}</DialogTitle>
      )}

      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
            deleteEmployees();
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

export default DeleteEmployeesDialog;
