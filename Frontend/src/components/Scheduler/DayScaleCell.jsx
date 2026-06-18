import { styled } from '@mui/material/styles';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';
import { classes, getStyledDayScaleCellStyles } from './SchedulerConfig';

export const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(({ theme }) => getStyledDayScaleCellStyles(theme));

const DayScaleCell = (props) => {
  const { startDate } = props;

  if (startDate.getDate() === new Date().getDate()) {
    return <StyledWeekViewDayScaleCell {...props} className={classes.today} />;
  }
  return <StyledWeekViewDayScaleCell {...props} />;
};

export default DayScaleCell;
