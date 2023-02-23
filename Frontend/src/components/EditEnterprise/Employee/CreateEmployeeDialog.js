import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Stack, TextField} from "@mui/material";
import React, {useEffect, useState} from 'react';

const initialState = {
    name: ""
}

const CreateEmployeeDialog = ({ open, setOpen, editedEmployee, setEditedEmployee, uniqueEmployees, addEmployee, updateEmployee }) => {

    const editingMode = () => editedEmployee && setEditedEmployee && updateEmployee && !addEmployee

    const [initialClick, setInitialClick] = useState(false);

    const [errors, setErrors] = useState(initialState);

    const [employee, setEmployee] = useState(() => {
        if (editingMode()) {
            return editedEmployee
        }  else {
            return initialState
        }
    });

    const handleClose = () => {
        setOpen(false)
        if (editingMode()) {
            setEditedEmployee(undefined);
        }
    }

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setEmployee({
            ...employee,
            [name]: value
        });
    }

    const validate = () => {
        let nameError = "";
        if (employee.name === "") {
            nameError = "Choose a name!"
        }
        if (uniqueEmployees.includes(employee.name)) {
            nameError = "An employee with this name already exists!"
        }
        setErrors({
            ...errors,
            name: nameError
        })
        return !(nameError);
    }

    useEffect(() => {
        validate();
    }, [employee])

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    { editingMode()
                        ? "Edit your employee"
                        : "Add an employee"
                    }
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
                            error={initialClick && (errors.name !== "")}
                            helperText={initialClick && errors.name}
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
                        onClick={() => {
                            if (validate()) {
                                handleClose();

                                if (editingMode()) {
                                    updateEmployee(employee);
                                    setEditedEmployee(undefined);
                                } else {
                                    addEmployee(employee);
                                    setEmployee(initialState)
                                }
                                setInitialClick(false);
                            }
                            if (!initialClick) {
                                setInitialClick(true);
                            }
                        }}
                    >
                        { editingMode()
                            ? "Save"
                            : "Add"
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    )
}

export default CreateEmployeeDialog;