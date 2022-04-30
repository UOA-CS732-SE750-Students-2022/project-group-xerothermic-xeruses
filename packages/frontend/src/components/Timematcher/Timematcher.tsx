import * as React from 'react';
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
  busyTimes: Map<Date, boolean>;
  availableTimes: Map<Date, boolean>;
};

function formatDates(dates: Date[]) {
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
}

function generateTimes(times: Date[]) {
  const timeMap = new Map<string, Date>();
  if (times) {
    const startTime = times[0];
    timeMap.set(formatTime(startTime), startTime);
    const endTime = times[1];
    let time = startTime;
    while (time < endTime) {
      let newTime = new Date(time.getTime() + 15 * 60000);
      console.log(newTime); //15 min intervals converted into milliseconds
      let newTimeString = formatTime(newTime);
      console.log(newTimeString);
      timeMap.set(newTimeString, newTime);
      time = newTime;
    }
  }

  return { timeMap };
}

function formatTime(time: Date) {
  const hour = time.getHours();
  const minutes = time.getMinutes() === 0 ? '00' : time.getMinutes();
  const ampm = hour >= 12 ? 'pm' : 'am';
  return hour > 12 ? `${hour - 12}:${minutes} ${ampm}` : `${hour}:${minutes} ${ampm}`;
}

function isAvailable(availableTimes: Map<Date, Boolean>, cellTime: Date, cellDate: Date): Boolean {
  const cellDateAndTime = new Date(cellDate).setTime(cellTime.getTime());
  return availableTimes.get(cellDate) ? true : false;
}

const Timematcher = ({ rowTitle, dates, timeRange, busyTimes, availableTimes }: TimematcherProps) => {
  const allDates = formatDates(dates);
  const times = generateTimes(timeRange);

  return (
    <div>
      <TableContainer component={Paper} className={styles.table}>
        <Table stickyHeader className={styles.tableContent}>
          <TableHead>
            <TableRow>
              <TableCell>{rowTitle}</TableCell>
              {Array.from(allDates.dateMap.keys()).map((date) => (
                <TableCell align="right">{date}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(times.timeMap.keys()).map((time) => (
              <TableRow key={time} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {time}
                </TableCell>
                {Array.from(allDates.dateMap.keys()).map(
                  (
                    date, //for each date
                  ) =>
                    isAvailable(availableTimes, times.timeMap.get(time) as Date, allDates.dateMap.get(date) as Date) ? (
                      <TableCell className={styles.othersAvailability} align="right">
                        hi
                      </TableCell>
                    ) : (
                      <TableCell className={styles.othersBusy} align="right">
                        bye
                      </TableCell>
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
