import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DeleteEmployeesDialog = ({ open, setOpen, numSelected, setSelected, deleteEmployees }) => {

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {numSelected >= 2
                ?
                <DialogTitle id="alert-dialog-title">
                    Are you sure that you want to delete {numSelected} employees?
                </DialogTitle>
                :
                <DialogTitle id="alert-dialog-title">
                    Are you sure that you want to delete 1 employee?
                </DialogTitle>
            }

            <DialogActions>
                <Button onClick={() => {
                    handleClose();
                    deleteEmployees();
                    setSelected([]);
                }}>Delete</Button>
                <Button onClick={handleClose} autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteEmployeesDialog;