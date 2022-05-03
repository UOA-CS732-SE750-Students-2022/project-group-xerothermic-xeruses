import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from './Timematcher.module.css';

type TimematcherProps = {
  rowTitle: string;
  dates: Date[];
  timeRange: Date[];
  userAvailability: Availability[];
  othersAvailability: Availability[];
};

type Availability = {
  start: Date;
  end: Date;
  available: boolean;
};

const generateDates = (dates: Date[]) => {
  const dateMap = new Map<string, Date>();
  if (dates) {
    dates.forEach((date) => {
      const dateString = `${date.toLocaleString('default', { weekday: 'short' })} ${date
        .getDate()
        .toString()} ${date.toLocaleString('default', { month: 'short' })}`;
      dateMap.set(dateString, date);
    });
  }

  return { dateMap };
};

const generateTimes = (times: Date[]) => {
  const timeMap = new Map<string, Date>();
  if (times) {
    const startTime = times[0];
    timeMap.set(formatTime(startTime), startTime);
    const endTime = times[1];
    let time = startTime;
    while (time < endTime) {
      let newTime = new Date(time.getTime() + 15 * 60000);
      let newTimeString = formatTime(newTime);
      timeMap.set(newTimeString, newTime);
      time = newTime;
    }
  }

  return { timeMap };
};

const formatTime = (time: Date) => {
  const hour = time.getHours();
  const minutes = time.getMinutes() === 0 ? '00' : time.getMinutes();
  const ampm = hour >= 12 ? 'pm' : 'am';
  return hour > 12 ? `${hour - 12}:${minutes} ${ampm}` : `${hour}:${minutes} ${ampm}`;
};

const isUserAvailable = (time: Date, date: Date, userAvailability: Availability[]): boolean => {
  let currentCell = getCell(time, date);
  for (let i = 0; i < userAvailability.length; i++) {
    if (userAvailability[i].start.getTime() === currentCell.cellStartDateTime.getTime()) {
      return userAvailability[i].available;
    }
  }
  return false;
};

const areOthersAvailable = (time: Date, date: Date, othersAvailability: Availability[]): boolean => {
  let currentCell = getCell(time, date);
  for (let i = 0; i < othersAvailability.length; i++) {
    if (othersAvailability[i].start.getTime() === currentCell.cellStartDateTime.getTime()) {
      return othersAvailability[i].available;
    }
  }
  return false;
};

const bothAvailable = (
  time: Date,
  date: Date,
  userAvailability: Availability[],
  othersAvailability: Availability[],
): boolean => {
  let iAmAvailable = areOthersAvailable(time, date, userAvailability);
  let othersAreAvailable = areOthersAvailable(time, date, othersAvailability);
  if (iAmAvailable && othersAreAvailable) {
    return true;
  }

  return false;
};

const getCell = (time: Date, date: Date) => {
  const cellStartDateTime = new Date(date);
  cellStartDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
  const cellEndDateTime = new Date(cellStartDateTime.getTime() + 15 * 60000);
  return { cellStartDateTime, cellEndDateTime };
};

const Timematcher = ({ rowTitle, dates, timeRange, userAvailability, othersAvailability }: TimematcherProps) => {
  const allDates = generateDates(dates);
  const times = generateTimes(timeRange);
  let column_id = 0;
  let row_id = 0;

  return (
    <div>
      <TableContainer component={Paper} className={styles.table}>
        <Table stickyHeader className={styles.tableContent}>
          <TableHead>
            <TableRow className={styles.tableColumn} key={column_id}>
              <TableCell className={(styles.dates, styles.time)} key={column_id++}>
                {rowTitle}
              </TableCell>
              {Array.from(allDates.dateMap.keys()).map((date) => (
                <TableCell align="center" className={styles.dates} key={date}>
                  {date}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(times.timeMap.keys()).map((time) => (
              <TableRow key={row_id}>
                <TableCell className={styles.leftCol} align="left" component="th" scope="row" key={row_id++}>
                  {time}
                </TableCell>
                {Array.from(allDates.dateMap.keys()).map((date) =>
                  bothAvailable(
                    times.timeMap.get(time) as Date,
                    allDates.dateMap.get(date) as Date,
                    userAvailability,
                    othersAvailability,
                  ) ? (
                    <TableCell
                      className={styles.bothAvailable}
                      key={time + date}
                      data-testid={'both-available'}
                    ></TableCell>
                  ) : isUserAvailable(
                      times.timeMap.get(time) as Date,
                      allDates.dateMap.get(date) as Date,
                      userAvailability,
                    ) ? (
                    <TableCell
                      className={styles.userAvailable}
                      key={time + date}
                      data-testid={'user-available'}
                    ></TableCell>
                  ) : areOthersAvailable(
                      times.timeMap.get(time) as Date,
                      allDates.dateMap.get(date) as Date,
                      othersAvailability,
                    ) ? (
                    <TableCell
                      className={styles.othersAvailable}
                      key={time + date}
                      data-testid={'others-available'}
                    ></TableCell>
                  ) : (
                    <TableCell key={time + date} data-testid={'noone-available'}></TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Timematcher;
