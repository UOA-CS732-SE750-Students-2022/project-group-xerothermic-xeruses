import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from './Timematcher.module.css';

type TimematcherProps = {
  datesPicked: Date[];
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

const Timematcher = ({ datesPicked, timeRange, userAvailability, othersAvailability }: TimematcherProps) => {
  const dates = generateDates(datesPicked);
  const times = generateTimes(timeRange);
  let columnKey = 0;
  let rowKey = 0;

  const tableCellColour = (time: Date, date: Date) => {
    const { bothAvailable, userAvailable, othersAvailable } = isAvailable(
      time,
      date,
      userAvailability,
      othersAvailability,
    );
    if (bothAvailable) return 'both-available';
    if (userAvailable) return 'user-available';
    if (othersAvailable) return 'others-available';
    return 'noone-available';
  };

  return (
    <div>
      <TableContainer component={Paper} className={styles.table}>
        <Table stickyHeader className={styles.tableContent}>
          <TableHead>
            <TableRow className={styles.tableColumn} key={rowKey}>
              <TableCell className={(styles.dates, styles.time)} key={columnKey}>
                Time
              </TableCell>
              {Array.from(dates.keys()).map((date) => (
                <TableCell align="center" className={styles.dates} key={date}>
                  {date}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(times.keys()).map((time) => (
              <TableRow key={rowKey++}>
                <TableCell className={styles.leftCol} align="left" component="th" scope="row" key={rowKey++}>
                  {time}
                </TableCell>
                {Array.from(dates.keys()).map((date) => (
                  <TableCell
                    className={`${tableCellColour(times.get(time) as Date, dates.get(date) as Date)}`}
                    key={time + date}
                    data-testid={`${tableCellColour(times.get(time) as Date, dates.get(date) as Date)}`}
                  ></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Timematcher;
