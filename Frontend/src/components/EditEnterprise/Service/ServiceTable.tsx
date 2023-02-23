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
import {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import DeleteServicesDialog from "./DeleteServicesDialog"
import CreateServiceDialog from "./CreateServiceDialog"
import EditIcon from '@mui/icons-material/Edit';

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
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
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
    id: keyof Service;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'title',
        numeric: false,
        disablePadding: true,
        label: 'Title of Service',
    },
    {
        id: 'targetAudience',
        numeric: false,
        disablePadding: false,
        label: 'Target Audience',
    },
    {
        id: 'durationInMin',
        numeric: true,
        disablePadding: false,
        label: 'Duration (Minutes)',
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'Price (Euro)',
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Service) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof Service) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" sx={{ textAlign: "center" }}>
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
                        align={headCell.id !== 'title' ? 'right' : 'left'}
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
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%', fontWeight: "500" }}
                    variant="body1"
                    id="tableTitle"
                    component="div"
                >
                    Services
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete Service(s)">
                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => setOpenDeleteDialog(true)}
                        sx={{ whiteSpace: "nowrap", p: "5px 30px" }}
                    >
                        Delete Service
                        { numSelected >= 2 && "s"}
                    </Button>
                </Tooltip>
            ) : (
                <Tooltip title="Add Service">
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateDialog(true)}
                        sx={{ whiteSpace: "nowrap", p: "5px 30px"  }}
                    >
                        Add Service
                    </Button>
                </Tooltip>
            )}
        </Toolbar>
    );
}

interface ServiceTableProps {
    services: Service[],
    setServices: any;
}

interface Service {
    id: number;
    title: string;
    targetAudience: string;
    durationInMin: number;
    price: number;
}

export default function ServiceTable(props: ServiceTableProps) {
    const { services, setServices } = props;
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Service>('title');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editedService, setEditedService] = useState<Service | undefined>(undefined);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Service,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = services.map((n) => n.title);
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
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
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
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - services.length) : 0;

    const deleteServices = () => {
        const newServices = services.filter((service) => !selected.includes(service.title));
        setServices(newServices);
    }

    const updateService = (newService: Service) => {
        const newServices = services.map((service) => {
            if (service.id === newService.id) {
                return newService
            } else {
                return service
            }
        });
        setServices(newServices)
    }

    const addService = (newService: Service) => {
        const newServices = [
            ...services,
            newService
        ]
        setServices(newServices);
    }

    const getUniqueServices = (editingMode: boolean) => {
        let relevantServices = services;
        if (editingMode) {
            relevantServices = relevantServices.filter((service) => service.id !== editedService.id)
        }
        return relevantServices.map((service) => `${service.title +  service.targetAudience}`)
    }

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    setOpenDeleteDialog={setOpenDeleteDialog}
                    setOpenCreateDialog={setOpenCreateDialog}
                />
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
                            rowCount={services.length}
                        />
                        <TableBody>
                            {stableSort(services, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((service, index) => {
                                    // @ts-ignore
                                    const isItemSelected = isSelected(service.title);
                                    const labelId = `enhanced-table-checkbox-${index}`;


                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={service.title + "-" + service.targetAudience}
                                            selected={isItemSelected}
                                        >
                                            <TableCell sx={{ p: "0", textAlign: "center" }}>
                                                <IconButton onClick={() => {
                                                    // @ts-ignore
                                                    setEditedService(service)
                                                    setOpenEditDialog(true)
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    // @ts-ignore
                                                    onChange={(event) => handleClick(event, service.title)}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {service.title}
                                            </TableCell>
                                            <TableCell align="right">{service.targetAudience}</TableCell>
                                            <TableCell align="right">{service.durationInMin}</TableCell>
                                            <TableCell align="right">{service.price}</TableCell>
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
                    count={services.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>

            <DeleteServicesDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} numSelected={selected.length} setSelected={setSelected} deleteServices={deleteServices} />

            {/* CREATE */}
            <CreateServiceDialog
                open={openCreateDialog}
                setOpen={setOpenCreateDialog}
                editedService={undefined}
                setEditedService={undefined}
                uniqueServices={getUniqueServices(false)}
                addService={addService}
                updateService={undefined}
            />

            {/* EDIT */}
            {editedService &&
                <CreateServiceDialog open={openEditDialog}
                                     setOpen={setOpenEditDialog}
                                     editedService={editedService}
                                     setEditedService={setEditedService}
                                     uniqueServices={getUniqueServices(true)}
                                     addService={undefined}
                                     updateService={updateService}
                />
            }
        </>
    );
}
