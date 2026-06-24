import { styled } from '@mui/material/styles';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';
import { classes, getStyledTimeTableCellStyles, getStyledDayScaleCellStyles } from './SchedulerConfig';

export const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => getStyledTimeTableCellStyles(theme));

export const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(({ theme }) => getStyledDayScaleCellStyles(theme));

const TimeTableCell = (props) => {
  const { startDate } = props;
  const date = new Date(startDate);

  if (date.getDate() === new Date().getDate()) {
    return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />;
  }
  return <StyledWeekViewTimeTableCell {...props} />;
};

export default TimeTableCell;
