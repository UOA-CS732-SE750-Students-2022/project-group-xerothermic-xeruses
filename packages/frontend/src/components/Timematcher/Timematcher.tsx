import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from './Timematcher.module.css';

type TimematcherProps = {
  dates: Date[];
  timeRange: [Date, Date];
  userAvailability: Availability[];
  othersAvailability: Availability[];
};

type Availability = {
  start: Date;
  end: Date;
  available: boolean;
};

const generateDates = (dates: Date[]) =>
  new Map(
    dates.map((d) => [d.toLocaleString(navigator.language, { weekday: 'short', day: 'numeric', month: 'short' }), d]),
  );

const generateTimes = (times: Date[]) => {
  const timeMap = new Map<string, Date>();
  const [startTime, endTime] = times;
  timeMap.set(formatTime(startTime), startTime);
  let time = startTime;
  const FIFTEEN_MINUTES = 15 * 60000;
  while (time < endTime) {
    let newTime = new Date(time.getTime() + FIFTEEN_MINUTES);
    let newTimeString = formatTime(newTime);
    timeMap.set(newTimeString, newTime);
    time = newTime;
  }

  return timeMap;
};

const formatTime = (time: Date) => {
  const hour = time.getHours();
  const minutes = time.getMinutes() === 0 ? '00' : time.getMinutes();
  const ampm = hour >= 12 ? 'pm' : 'am';
  return hour > 12 ? `${hour - 12}:${minutes} ${ampm}` : `${hour}:${minutes} ${ampm}`;
};

const isAvailable = (
  time: Date,
  date: Date,
  userAvailability: Availability[],
  othersAvailability: Availability[],
): { userAvailable: boolean; othersAvailable: boolean; bothAvailable: boolean } => {
  let currentCell = getCell(time, date);
  let userAvailable = false;
  let othersAvailable = false;
  let bothAvailable = false;
  for (let i = 0; i < userAvailability.length; i++) {
    if (userAvailability[i].start.getTime() === currentCell.cellStartDateTime.getTime()) {
      userAvailable = userAvailability[i].available;
    }
    if (othersAvailability[i].start.getTime() === currentCell.cellStartDateTime.getTime()) {
      othersAvailable = othersAvailability[i].available;
    }
  }

  if (userAvailable && othersAvailable) bothAvailable = true;

  return { userAvailable, othersAvailable, bothAvailable };
};

const getCell = (time: Date, date: Date) => {
  const cellStartDateTime = new Date(date);
  cellStartDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
  const cellEndDateTime = new Date(cellStartDateTime.getTime() + 15 * 60000);
  return { cellStartDateTime, cellEndDateTime };
};

const Timematcher = ({ dates, timeRange, userAvailability, othersAvailability }: TimematcherProps) => {
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
                Time
              </TableCell>
              {Array.from(allDates.keys()).map((date) => (
                <TableCell align="center" className={styles.dates} key={date}>
                  {date}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(times.keys()).map((time) => (
              <TableRow key={row_id}>
                <TableCell className={styles.leftCol} align="left" component="th" scope="row" key={row_id++}>
                  {time}
                </TableCell>
                {Array.from(allDates.keys()).map((date) =>
                  isAvailable(times.get(time) as Date, allDates.get(date) as Date, userAvailability, othersAvailability)
                    .bothAvailable ? (
                    <TableCell
                      className={styles.bothAvailable}
                      key={time + date}
                      data-testid={'both-available'}
                    ></TableCell>
                  ) : isAvailable(
                      times.get(time) as Date,
                      allDates.get(date) as Date,
                      userAvailability,
                      othersAvailability,
                    ).userAvailable ? (
                    <TableCell
                      className={styles.userAvailable}
                      key={time + date}
                      data-testid={'user-available'}
                    ></TableCell>
                  ) : isAvailable(
                      times.get(time) as Date,
                      allDates.get(date) as Date,
                      userAvailability,
                      othersAvailability,
                    ).othersAvailable ? (
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
