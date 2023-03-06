import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import DeleteEmployeesDialog from './DeleteEmployeesDialog.js';
import CreateEmployeeDialog from './CreateEmployeeDialog.js';
import EditIcon from '@mui/icons-material/Edit';
import { deleteEmployeeById } from '../../../context/EmployeeActions.js';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Employee;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name of Employee',
  },
  {
    id: 'picture',
    numeric: false,
    disablePadding: false,
    label: 'Picture',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Employee) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Employee) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ textAlign: 'center' }}>
          Edit
        </TableCell>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id !== 'name' ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  setOpenDeleteDialog: any;
  setOpenCreateDialog: any;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, setOpenDeleteDialog, setOpenCreateDialog } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 6 },
        pr: { xs: 6, sm: 6 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%', fontWeight: '500' }} variant="body1" id="tableTitle" component="div">
          Employees
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete Employee(s)">
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => setOpenDeleteDialog(true)}
            sx={{ whiteSpace: 'nowrap', p: '5px 30px' }}
          >
            Delete Employee
            {numSelected >= 2 && 's'}
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title="Add Employee">
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenCreateDialog(true)} sx={{ whiteSpace: 'nowrap', p: '5px 30px' }}>
            Add Employee
          </Button>
        </Tooltip>
      )}
    </Toolbar>
  );
}

interface EmployeeTableProps {
  employees: Employee[];
  setEmployees: any;
}

interface Employee {
  id: number;
  name: string;
  picture: any;
}

export default function EmployeeTable(props: EmployeeTableProps) {
  const { employees, setEmployees } = props;
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Employee>('name');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [editedEmployee, setEditedEmployee] = useState<Employee | undefined>(undefined);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Employee) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = employees.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;

  const deleteEmployees = () => {
    //Delete from DB
    const employeesToDelete = employees.filter((employee) => selected.includes(employee.name));
    employeesToDelete.forEach((employee) => {
      deleteEmployeeById(employee.id);
    })    
    //Update UI
    const newEmployees = employees.filter((employee) => !selected.includes(employee.name));
    setEmployees(newEmployees);
  };

  const updateEmployee = (newEmployee: Employee) => {
    const newEmployees = employees.map((employee) => {
      if (employee.id === newEmployee.id) {
        return newEmployee;
      } else {
        return employee;
      }
    });
    setEmployees(newEmployees);
  };

  const addEmployee = (newEmployee: Employee) => {
    const newEmployees = [...employees, newEmployee];
    setEmployees(newEmployees);
  };

  const getUniqueEmployees = (editingMode: boolean) => {
    let relevantEmployees = employees;
    if (editingMode) {
      relevantEmployees = relevantEmployees.filter((employee) => employee.name !== editedEmployee.name);
    }
    //  + employee.picture
    return relevantEmployees.map((employee) => `${employee.name}`);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <EnhancedTableToolbar numSelected={selected.length} setOpenDeleteDialog={setOpenDeleteDialog} setOpenCreateDialog={setOpenCreateDialog} />
        <TableContainer>
          <Table
            /*sx={{ minWidth: 750 }}*/
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={employees.length}
            />
            <TableBody>
              {stableSort(employees, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee, index) => {
                  // @ts-ignore
                  const isItemSelected = isSelected(employee.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  // @ts-ignore
                  return (
                    <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={employee.name} selected={isItemSelected}>
                      <TableCell sx={{ p: '0', textAlign: 'center' }}>
                        <IconButton
                          onClick={() => {
                            // @ts-ignore
                            setEditedEmployee(employee);
                            setOpenEditDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          // @ts-ignore
                          onChange={(event) => handleClick(event, employee.name)}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {employee.name}
                      </TableCell>
                      {/*<TableCell align="right">{employee.picture}</TableCell>*/}
                      <TableCell align="right">
                        {employee.picture && (
                          <img
                            src={URL.createObjectURL(employee.picture)}
                            alt={employee.picture.name}
                            height="60px"
                            width="60px"
                            style={{ objectFit: 'cover', margin: '6px 12px 0 0', borderRadius: '100%' }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={employees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <DeleteEmployeesDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        numSelected={selected.length}
        setSelected={setSelected}
        deleteEmployees={deleteEmployees}
      />

      {/* CREATE */}
      <CreateEmployeeDialog
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        editedEmployee={undefined}
        setEditedEmployee={undefined}
        uniqueEmployees={getUniqueEmployees(false)}
        addEmployee={addEmployee}
        updateEmployee={undefined}
      />

      {/* EDIT */}
      {editedEmployee && (
        <CreateEmployeeDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          editedEmployee={editedEmployee}
          setEditedEmployee={setEditedEmployee}
          uniqueEmployees={getUniqueEmployees(true)}
          addEmployee={undefined}
          updateEmployee={updateEmployee}
        />
      )}
    </>
  );
}
