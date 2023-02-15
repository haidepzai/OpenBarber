// noinspection LanguageDetectionInspection

import * as React from 'react';
import Paper from '@mui/material/Paper';
import {ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    DayView,
    Appointments,
    Toolbar,
    ViewSwitcher,
    DateNavigator,
    TodayButton,
    AppointmentTooltip,
    AppointmentForm,
    ConfirmationDialog,
    DragDropProvider,
    Resources
} from '@devexpress/dx-react-scheduler-material-ui';
import { styled, alpha } from '@mui/material/styles';
import {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

/*const currentDate = '2018-11-01';*/
/*const currentDate = new Date();*/

/* TODO: Customize the Appointment Form - Mitarbeiter ändern (zur Demo) https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/editing/#customize-the-appointment-form
*  Doppelklick auf Zelle --> Add
* */

const schedulerData = [
    { startDate: '2023-02-09T09:45', endDate: '2023-02-09T11:00', title: 'Meeting' },
    { startDate: '2023-02-09T12:00', endDate: '2023-02-09T13:30', title: 'Go to a gym' },
    {
        title: 'Website Re-Design Plan',
        startDate: new Date(2023,2, 10, 9, 35),
        endDate: new Date(2023, 2, 10, 11, 30),
        id: 0,
        location: 'Room 1',
    },
];

const PREFIX = 'Demo';

const classes = {
    today: `${PREFIX}-today`,
    todayCell: `${PREFIX}-todayCell`,
    flexibleSpace: `${PREFIX}-flexibleSpace`,
    /*weekend: `${PREFIX}-weekend`,
    weekendCell: `${PREFIX}-weekendCell`,*/
};

const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
    [`&.${classes.flexibleSpace}`]: {
        /*margin: '0 auto 0 0',
        display: 'flex',
        alignItems: 'center',*/
    },
}));

const EmployeeSelect = ({ value, setValue, options}) => {
    return (
        /*<Box sx={{ minWidth: 200, marginRight: "30px" }}>*/
            <FormControl sx={{ minWidth: 200, marginRight: "30px" }} size="small">
                <InputLabel id="demo-simple-select-label">Hairdresser</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label="Hairdresser"
                    onChange={(event) => setValue(event.target.value)}
                >
                    <MenuItem value={""}><em>None</em></MenuItem>
                    {options.map((option) => (
                        <MenuItem key={option.id} value={option.id}>{option.text}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        /*</Box>*/
    )
}

const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
    [`&.${classes.todayCell}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.06),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.14),
        },
        '&:focus': {
            backgroundColor: alpha(theme.palette.primary.main, 0.18),
        },
    },
    /*[`&.${classes.weekendCell}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        '&:hover': {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        },
        '&:focus': {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        },
    },*/
}));

const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(({ theme }) => ({
    [`&.${classes.today}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    /*[`&.${classes.weekend}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.06),
    },*/
}));

const FlexibleSpace = ({/*employeeFilter, setEmployeeFilter,*/ children, style, ...restProps}) => (
    /*<StyledToolbarFlexibleSpace {...props} className={classes.flexibleSpace}>
        <EmployeeSelect value={employeeFilter} setValue={setEmployeeFilter} />
        <p>A</p>
    </StyledToolbarFlexibleSpace>*/
    <Toolbar.FlexibleSpace
        {...restProps}
        style={{
            ...style
        }}
    >
        {/*{children}*/}
        <EmployeeSelect />
    </Toolbar.FlexibleSpace>
);

const TimeTableCell = (props) => {
    const { startDate, today } = props;
    const date = new Date(startDate);

    if (date.getDate() === new Date().getDate()) {
        return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />;
    }
    /*if (date.getDay() === 0 || date.getDay() === 6) {
        return <StyledWeekViewTimeTableCell {...props} className={classes.weekendCell} />;
    } */
    return <StyledWeekViewTimeTableCell {...props} />;
};

const DayScaleCell = (props) => {

    const { startDate, today } = props;

    if (today) {
        return <StyledWeekViewDayScaleCell {...props} className={classes.today} />;
    }
    /*if (startDate.getDay() === 0 || startDate.getDay() === 6) {
        return <StyledWeekViewDayScaleCell {...props} className={classes.weekend} />;
    } */
    return <StyledWeekViewDayScaleCell {...props} />;
};

const appointmentComponent = ({ children, style, ...restProps }) => (
    <Appointments.Appointment
        {...restProps}
        style={{
            ...style,
            backgroundColor: '#6D5344',
            borderRadius: '8px',
            boxShadow: '-2px 2px 6px rgba(0, 0, 0, 0.4)',
            border: 'unset',
            /* doesnt work in react
            '&.hover': {
                opacity: '0.6',
            },*/
        }}
    >
        {children}
    </Appointments.Appointment>
);

const appointmentContentComponent = ({ data, ...restProps }) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    const difference = Math.floor((new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60));
    return (
        <Appointments.AppointmentContent
            {...restProps}
            data={data}
        >
            {/*{ difference }*/}
            <div style={{ overflow: "hidden" }}>
                <div style={{ fontWeight: "bold" }}>{data.title}</div>
                { difference > 30 &&
                    <>
                        <div>{new Date(data.startDate).toLocaleTimeString("en-US", options) + " - "}</div>
                        <div>{new Date(data.endDate).toLocaleTimeString("en-US", options)}</div>
                    </>
                }
                <div>{data.customer.name}</div>
            </div>
        </Appointments.AppointmentContent>
    )
}

const draftAppointmentComponent = ({ children, style, ...restProps }) => (
    <DragDropProvider.DraftAppointment
        {...restProps}
        style={{
            ...style,
            backgroundColor: '#6D5344',
            transform: "scale(1.1)"
        }}
    >
        {children}
    </DragDropProvider.DraftAppointment>
);

const dragDisabledIds = new Set([1])

const allowDrag = ({ id }) => !dragDisabledIds.has(id);

const SchedulerPage =  () => {

    /* ID MUSS unique sein sonst fkt. Filter nicht richtig */
    const [appointmentData, setAppointmentData] = useState([
        { id: 0, startDate: '2023-02-09T09:45', endDate: '2023-02-09T11:00', hairdresser: 1, service: 1, customer: { id: 1, name: 'Alexander Hahn' }, title: 'Waschen, Schneiden, Föhnen', customerResource: 1 },
        { id: 1, startDate: '2023-02-09T12:00', endDate: '2023-02-09T13:30', hairdresser: 2, service: 2, customer: { id: 2, name: 'Max Mustermann' }, title: 'Trockenhaarschnitt', customerResource: 2 },
        { id: 2, startDate: '2023-02-09T09:45', endDate: '2023-02-09T11:00', hairdresser: 2, service: 1, customer: { id: 3, name: 'Cristiano Ronaldo' }, title: 'Waschen, Schneiden, Föhnen', customerResource: 3 },
        { id: 3, startDate: '2023-02-09T12:00', endDate: '2023-02-09T13:30', hairdresser: 1, service: 2, customer: { id: 4, name: 'Kylian Mbappe' }, title: 'Trockenhaarschnitt', customerResource: 4 },
        { id: 4, startDate: '2023-02-10T14:00', endDate: '2023-02-10T15:00', hairdresser: 1, service: 3, customer: { id: 5, name: 'LeBron James' }, title: 'Haare färben', customerResource: 5 },
        { id: 5, startDate: '2023-02-10T12:30', endDate: '2023-02-10T13:30', hairdresser: 2, service: 4, customer: { id: 6, name: 'Luka Doncic' }, title: "Strähnen", customerResource: 6 },
        { id: 6, startDate: '2023-02-10T09:00', endDate: '2023-02-10T09:30', hairdresser: 2, service: 4, customer: { id: 6, name: 'Luka Doncic' }, title: "Strähnen", customerResource: 6 },

    ]);

    const [mainResourceName, setMainResourceName] = useState('hairdresser')
    const [resources, setResources] = useState([
        {
            fieldName: 'hairdresser',
            title: 'Hairdresser',
            instances: [
                { id: 1, text: 'Alexandra' },
                { id: 2, text: 'Peter' },
                /*{ id: 3, text: 'Max' },
                { id: 4, text: 'Selina' },
                { id: 5, text: 'Alex' },*/
            ],
        },
        {
            fieldName: 'service',
            title: 'Service',
            instances: [
                { id: 1, text: 'Waschen, Schneiden, Föhnen' },
                { id: 2, text: 'Trockenhaarschnitt' },
                { id: 3, text: 'Haare färben' },
                { id: 4, text: 'Strähnen' },
                { id: 5, text: 'Kosmetik - Wimpern' },
            ],
        },
        {
            fieldName: 'customer',
            title: 'Customer',
            instances: [
                { id: 1, text: 'Alexander Hahn' },
                { id: 2, text: 'Max Mustermann' },
                { id: 3, text: 'Cristiano Ronaldo' },
                { id: 4, text: 'Kylian Mbappe' },
                { id: 5, text: 'LeBron James' },
                { id: 6, name: 'Luka Doncic' }
            ],
        },
        {
            fieldName: 'customerResource',
            title: 'Customer',
            instances: [
                { id: 1, text: 'Alexander Hahn' },
                { id: 2, text: 'Max Mustermann' },
                { id: 3, text: 'Cristiano Ronaldo' },
                { id: 4, text: 'Kylian Mbappe' },
                { id: 5, text: 'LeBron James' },
            ],
        }
    ])
    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentViewName, setCurrentViewName] = useState('Week');
    const [employeeFilter, setEmployeeFilter] = useState("");

    const filterAppointments = (appointments) => {
        if (employeeFilter) {
            const filteredAppointments = appointments.filter((appointment) => appointment.hairdresser === employeeFilter)
            return filteredAppointments
        } else {
            return appointments
        }
    }

    const commitChanges = ({ added, changed, deleted }) => {
        console.log("added", added)
        console.log("changed", changed)
        console.log("deleted", deleted)
        setAppointmentData((prevState) => {
            let data = prevState;
            if (added) {
                const startingAddedId = (prevState.length > 0) ? prevState[prevState.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }]
            }
            if (changed) {
                data = data.map((appointment) => (
                    changed[appointment.id] ? { ...appointment, ...changed[appointment.id]} : appointment
                ))
            }
            // "!== undefined" da undefined ja auch 0 sein kann
            if (deleted !== undefined) {
                data = data.filter((appointment) => appointment.id !== deleted);
            }
            return data;
        })
    }

    return (
        <>
            {/*<ResourceSwitcher
                resources={resources}
                mainResourceName={mainResourceName}
                onChange={(newMainResourceName) => setMainResourceName(newMainResourceName)}
            />*/}
            <Paper sx={{
                width: (currentViewName === "Day") ? "70%" : "100%",
                margin: "0 auto"
            }}>
                <Scheduler
                    data={filterAppointments(appointmentData)}
                    /*height={660}*/
                >
                    <ViewState
                        currentDate={currentDate}
                        onCurrentDateChange={(newDate) => setCurrentDate(newDate)}
                        defaultCurrentViewName={currentViewName}
                        onCurrentViewNameChange={(newViewName) => setCurrentViewName(newViewName)}
                    />
                    <EditingState
                        onCommitChanges={commitChanges}
                    />
                    <IntegratedEditing />
                    {/*day, week, month?*/}
                    <WeekView
                        // shop öffnungszeit
                        startDayHour={8}
                        // shop Schließungszeit
                        endDayHour={20}
                        // geschlossene Tage (Sonntag)
                        excludedDays={[0]}
                        // style - heutiger Tag (Tagesanzeige oben)
                        dayScaleCellComponent={DayScaleCell}
                        // style - heutiger Tag (Zelle)
                        timeTableCellComponent={TimeTableCell}
                    />
                    <DayView
                        startDayHour={8}
                        endDayHour={20}
                    />
                    <ConfirmationDialog />
                    <Toolbar
                        flexibleSpaceComponent={() => (
                            <Toolbar.FlexibleSpace>
                                <EmployeeSelect
                                    value={employeeFilter}
                                    handleChange={setEmployeeFilter}
                                    options={resources[0].instances}
                                />
                            </Toolbar.FlexibleSpace>
                        )}
                    />
                    {/* Switcher kann auch selbst definiert werden */}
                    <ViewSwitcher/>
                    <DateNavigator />
                    <TodayButton />
                    <Appointments
                        /*appointmentComponent={appointmentComponent}*/
                        appointmentContentComponent={appointmentContentComponent}
                    />
                    <AppointmentTooltip
                        showOpenButton
                        showCloseButton
                        showDeleteButton
                    />
                    <AppointmentForm
                        /*basicLayoutComponent={BasicLayout}*/
                    />
                    <DragDropProvider
                        allowDrag={allowDrag}
                        /*draftAppointmentComponent={draftAppointmentComponent}*/
                        /*sourceAppointmentComponent*/
                    />
                    <Resources
                        data={resources}
                        mainResourceName={mainResourceName}
                    />
                </Scheduler>
            </Paper>
        </>
    );
}

/* sonstiges:
*
* AllDayPanel / Appointments
* Recurring & Zero-Duration Appointments
*
*
*
* */

export default SchedulerPage;
