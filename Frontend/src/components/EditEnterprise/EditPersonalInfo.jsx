import { Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { Fragment, useContext } from 'react'
import AuthContext from '../../context/auth-context'
import { updateUser } from '../../context/UserActions'

const EditPersonalInfo = ({ onLoadingUser, onOpenSnackBar }) => {
    const authCtx = useContext(AuthContext);

    const saveUser = async () => {
        try {
            await updateUser(authCtx.userId, authCtx.user);
            onOpenSnackBar('User Changes saved!');
        } catch (error) {
            onOpenSnackBar('User could not be saved');
        }

    };

    const resetUser = async () => {
        await onLoadingUser();
        onOpenSnackBar('User Data reset!');
    };

    const handleUserChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        authCtx.setUser({
            ...authCtx.user,
            [name]: value,
        });
    };


    return (
        <Fragment>
            <Typography variant="h1" sx={{ fontSize: '22px', fontWeight: '500', color: 'rgba(0, 0, 0, 1)', m: '40px 0 10px 24px' }}>
                Personal Info
            </Typography>
            <Typography variant="h2" sx={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.45)', m: '0 0 20px 24px' }}>
                Update your personal information and account credentials here.
            </Typography>
            <Paper elevation={2}>
                <Stack
                    direction="column"
                    spacing={3}
                    divider={<Divider orientation="horizontal" flexItem />}
                    sx={{
                        padding: '24px 0',
                        '& > *': {
                            padding: '0 48px',
                        },
                        '& > * > *': {
                            flex: '1',
                        },
                        '& > * > p': {
                            fontWeight: '500',
                        },
                        '& > * > * > p': {
                            fontWeight: '500',
                        },
                    }}
                >
                    <Stack direction="row">
                        <Typography variant="body1">Name</Typography>
                        <TextField
                            InputLabelProps={{ shrink: false }}
                            name="name"
                            placeholder="Name"
                            value={authCtx.user.name === null ? '' : authCtx.user.name}
                            onChange={handleUserChange}
                            fullWidth
                        />
                    </Stack>

                    <Stack direction="row">
                        <Typography variant="body1">E-Mail Address</Typography>
                        <TextField
                            type="email"
                            InputLabelProps={{ shrink: false }}
                            name="email"
                            placeholder="E-Mail Address"
                            value={authCtx.user.email === null ? '' : authCtx.user.email}
                            onChange={handleUserChange}
                            fullWidth
                        />
                    </Stack>

                    <Stack direction="row">
                        <Typography variant="body1">Password</Typography>
                        <TextField
                            type="password"
                            InputLabelProps={{ shrink: false }}
                            name="password"
                            placeholder="Password"
                            value={authCtx.user.password === null ? '' : authCtx.user.password}
                            onChange={handleUserChange}
                            fullWidth
                        />
                    </Stack>
                </Stack>

                <Divider orientation="horizontal" sx={{ mb: '24px' }} />

                <Stack direction="row" aligncontent="center" justifyContent="space-between" sx={{ p: '0 24px 24px 24px' }} spacing={4}>
                    <Button variant="outlined" onClick={resetUser}>
                        Reset
                    </Button>
                    <Button variant="contained" onClick={saveUser}>
                        Save Changes
                    </Button>
                </Stack>
            </Paper>

        </Fragment>
    )
}

export default EditPersonalInfo
