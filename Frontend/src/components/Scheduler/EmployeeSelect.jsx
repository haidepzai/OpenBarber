import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const EmployeeSelect = ({ value, handleChange, options }) => {
  return (
    <FormControl sx={{ minWidth: 200, marginLeft: '30px' }} size="small">
      <InputLabel id="demo-simple-select-label">Hairdresser</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Hairdresser"
        onChange={(event) => handleChange(event.target.value)}
      >
        <MenuItem value={0}>
          <em>All</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default EmployeeSelect;
