import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DeleteServicesDialog = ({ open, setOpen, numSelected, setSelected, deleteServices }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      {numSelected >= 2 ? (
        <DialogTitle id="alert-dialog-title">Are you sure that you want to delete {numSelected} services?</DialogTitle>
      ) : (
        <DialogTitle id="alert-dialog-title">Are you sure that you want to delete 1 service?</DialogTitle>
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
          Delete
        </Button>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteServicesDialog;
