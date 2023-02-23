import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from "@mui/material/MenuItem";
import {InputAdornment, Stack, TextField} from "@mui/material";
import React, {useEffect, useState} from 'react';
import EuroIcon from '@mui/icons-material/Euro';

const EditEmployeeDialog = ({ open, setOpen, editedEmployee, uniqueEmployees, updateEmployee }) => {

    const [employee, setEmployee] = useState(editedEmployee);
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        console.log(editedEmployee)
    }, [editedEmployee])

    const handleClose = () => {
        setOpen(false)
    }

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setEmployee({
            ...employee,
            [name]: value
        });

        if (uniqueEmployees.includes(employee.name)) {
            setShowError(true);
        } else {
            if (showError) {
                setShowError(false);
            }
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Edit your Employee
                </DialogTitle>
                <DialogContent sx={{ width: "400px" }}>
                    <Stack direction="column" spacing={4}>

                        <TextField
                            type="text"
                            label="Name"
                            name="name"
                            placeholder="Name of Employee"
                            value={employee.name}
                            onChange={handleChange}
                            fullWidth
                            error={showError}
                            helperText={showError && "An employee with this name already exists!"}
                            sx={{ mt: "20px" }}
                        />

                    </Stack>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-between", m: "8px 24px 24px 24px", p: "0" }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        autoFocus
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={showError}
                        onClick={() => {
                            handleClose();
                            updateEmployee(employee);
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    )
}

export default EditEmployeeDialog;