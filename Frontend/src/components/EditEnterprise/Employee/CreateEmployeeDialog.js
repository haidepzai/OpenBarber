import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Stack, TextField } from '@mui/material';
import React, { useEffect, useState, useCallback, useReducer, useContext } from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createEmployee } from '../../../actions/EmployeeActions';
import AuthContext from '../../../context/auth-context';

const initialState = {
  name: '',
  title: '',
  picture: null
};

const employeeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_PICTURE':
      return { ...state, picture: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const CreateEmployeeDialog = ({ open, setOpen, editedEmployee, setEditedEmployee, uniqueEmployees, addEmployee, updateEmployee }) => {
  const editingMode = () => editedEmployee && setEditedEmployee && updateEmployee && !addEmployee;

  const [initialClick, setInitialClick] = useState(false);
  const [errors, setErrors] = useState(initialState);
  const authCtx = useContext(AuthContext);

  const [employee, dispatch] = useReducer(employeeReducer, initialState);

  const handleClose = () => {
    setOpen(false);
    if (editingMode()) {
      setEditedEmployee(undefined);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    dispatch({ type: `SET_${name.toUpperCase()}`, payload: value });
  };

  const handlePictureUpload = (event) => {
    dispatch({ type: 'SET_PICTURE', payload: event.target.files[0] });
  };

  const handlePictureDelete = () => {
    dispatch({ type: 'SET_PICTURE', payload: null });
  };

  const validate = useCallback(() => {
    let nameError = '';
    if (employee.name === '') {
      nameError = 'Choose a name!';
    }
    if (uniqueEmployees.includes(employee.name)) {
      nameError = 'An employee with this name already exists!';
    }
    setErrors({
      ...errors,
      name: nameError,
    });
    return !nameError;
  }, [employee.name, errors, uniqueEmployees]);

  const handleClick = async () => {
    if (validate()) {
      handleClose();

      // Update Employee
      if (editingMode()) {
        updateEmployee(employee);
        //await updateStylist(editedEmployee.id, employee);
        setEditedEmployee(undefined);
      } else { // Add Employee
        addEmployee(employee);
        await createEmployee(employee, authCtx.user.enterprise.id);
        dispatch({ type: 'RESET' });
      }
      setInitialClick(false);
    }
    if (!initialClick) {
      setInitialClick(true);
    }
  }

  useEffect(() => {
    if (editingMode()) {   
      dispatch({ type: 'SET_NAME', payload: editedEmployee.name });   
      dispatch({ type: 'SET_TITLE', payload: editedEmployee.title });  
    } 
  }, [])


  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{editingMode() ? 'Edit your employee' : 'Add an employee'}</DialogTitle>
        <DialogContent sx={{ width: '400px' }}>
          <Stack direction="column" spacing={4}>
            <TextField
              type="text"
              label="Name"
              name="name"
              placeholder="Name of Employee"
              value={employee.name}
              onChange={handleChange}
              fullWidth
              error={initialClick && errors.name !== ''}
              helperText={initialClick && errors.name}
              sx={{ mt: '20px' }}
            />

            <TextField
              type="text"
              label="Title"
              name="title"
              placeholder="Title of Employee"
              value={employee.title}
              onChange={handleChange}
              fullWidth
              //error={initialClick && errors.title !== ''}
              //helperText={initialClick && errors.title}
              sx={{ mt: '20px' }}
            />

            <Stack direction="column" spacing={4} alignItems="center">
              <Stack direction="row" justifyContent={employee.picture ? 'space-between' : 'center'} sx={{ width: '100%' }}>
                <Button variant="contained" component="label" endIcon={<PhotoCamera />}>
                  Upload Picture
                  <input type="file" hidden accept="image/png, image/jpeg" onChange={handlePictureUpload} />
                </Button>
                {employee.picture && (
                  <Button variant="outlined" endIcon={<DeleteOutlineIcon />} onClick={handlePictureDelete}>
                    Delete
                  </Button>
                )}
              </Stack>
              {employee.picture && (
                <Box sx={{ mt: '24px' }}>
                  <img alt="employee" src={URL.createObjectURL(employee.picture)} width="100%" height="auto" style={{ maxHeight: '250px', objectFit: 'cover' }} />
                </Box>
              )}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', m: '8px 24px 24px 24px', p: '0' }}>
          <Button variant="outlined" onClick={handleClose} autoFocus>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleClick}
          >
            {editingMode() ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateEmployeeDialog;
