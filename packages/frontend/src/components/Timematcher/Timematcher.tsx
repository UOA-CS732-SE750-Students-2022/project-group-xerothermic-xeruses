import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from './Timematcher.module.css';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_INTERVALS } from '../../apollo/queries';

type TimematcherProps = {
  rowTitle: string;
  dates: Date[];
  timeRange: Date[];
  availabilityIds: string[];
};

function generateDates(dates: Date[]) {
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
      let newTime = new Date(time.getTime() + 15 * 60000); //15 min intervals converted into milliseconds
      let newTimeString = formatTime(newTime);
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

function getCell(time: Date, date: Date) {
  const cellStartDateTime = new Date(date);
  cellStartDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
  const cellEndDateTime = new Date(cellStartDateTime.getTime() + 15 * 60000);
  return { cellStartDateTime, cellEndDateTime };
}

const Timematcher = ({ rowTitle, dates, timeRange, availabilityIds }: TimematcherProps) => {
  const allDates = generateDates(dates);
  const times = generateTimes(timeRange);
  const [getAvailability, { error, data }] = useLazyQuery(GET_USER_INTERVALS, {
    variables: {
      userIntervalInput: {
        intervals: [
          {
            start: new Date(),
            end: new Date(),
          },
        ],
      },
      availabilityIds: [],
    },
  });

  if (error) {
    console.log(error);
  }

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
                  async (
                    date, //for each date at that time
                  ) =>
                    (
                      await getAvailability({
                        variables: {
                          userIntervalInput: {
                            intervals: [
                              {
                                start: getCell(times.timeMap.get(time) as Date, allDates.dateMap.get(date) as Date)
                                  .cellStartDateTime,
                                end: getCell(times.timeMap.get(time) as Date, allDates.dateMap.get(date) as Date)
                                  .cellEndDateTime,
                              },
                            ],
                          },
                          availabilityIds: [],
                        },
                      })
                    ).data.getUserIntervals.available ? (
                      <TableCell className={styles.selfAvailable}></TableCell>
                    ) : (
                      <TableCell>busy</TableCell>
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
