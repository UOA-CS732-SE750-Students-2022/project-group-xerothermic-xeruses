import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from './Timematcher.module.css';
import { useState } from 'react';
import Button from '../Button';
import { ManualAvailabilityDTO } from '@flocker/api-types';

type TimematcherProps = {
  datesPicked: Date[];
  timeRange: [Date, Date];
  userAvailability: Availability[];
  othersAvailability: Availability[];
  userInFlock: boolean;
  onManualSave?: (manualAvailabilities: ManualAvailabilityDTO[]) => void;
};

type Availability = {
  start: Date;
  end: Date;
  available: boolean;
};

const FIFTEEN_MINUTES = 15 * 60000;

const generateDates = (dates: Date[]) =>
  new Map(
    dates.map((d) => [d.toLocaleString(navigator.language, { weekday: 'short', day: 'numeric', month: 'short' }), d]),
  );

const generateTimes = (times: [Date, Date]) => {
  const timeMap = new Map<string, Date>();
  const [startTime, endTime] = times;
  timeMap.set(formatTime(startTime), startTime);
  let time = startTime;
  const actualEndTime = new Date(endTime.getTime() - FIFTEEN_MINUTES);
  while (time < actualEndTime) {
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
): { userAvailable: boolean; othersAvailable: boolean } => {
  let currentCell = getCell(time, date);
  let userAvailable = false;
  let othersAvailable = false;

  if (userAvailability.length > 0) {
    for (let i = 0; i < userAvailability.length; i++) {
      if (userAvailability[i].start.getTime() === currentCell.cellStartDateTime.getTime()) {
        userAvailable = userAvailability[i].available;
      }
    }
  }

  for (let i = 0; i < othersAvailability.length; i++) {
    if (othersAvailability[i].start.getTime() === currentCell.cellStartDateTime.getTime()) {
      othersAvailable = othersAvailability[i].available;
    }
  }

  return { userAvailable, othersAvailable };
};

const getCell = (time: Date, date: Date) => {
  const cellStartDateTime = new Date(date);
  cellStartDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
  const cellEndDateTime = new Date(cellStartDateTime.getTime() + 15 * 60000);
  return { cellStartDateTime, cellEndDateTime };
};

const Legend: React.FC = () => {
  return (
    <div className={styles.legend}>
      <div className={`${styles.circleAvailability} ${styles.circleBothAvailable}`} />
      <h3>All available</h3>
      <div className={`${styles.circleAvailability} ${styles.circleUserAvailable}`} />
      <h3>You're available</h3>
      <div className={`${styles.circleAvailability} ${styles.circleFlockAvailable}`} />
      <h3>Others available</h3>
    </div>
  );
};

const Timematcher = ({
  datesPicked,
  timeRange,
  userAvailability,
  othersAvailability,
  userInFlock,
  onManualSave = () => {},
}: TimematcherProps) => {
  const dates = generateDates(datesPicked);
  const times = generateTimes(timeRange);
  let cellKey = 0;
  let rowKey = 0;

  const [inManualMode, setInManualMode] = useState(false);
  const [manualAvailabilities, setManualAvailabilities] = useState<Set<ManualAvailabilityDTO>>(
    new Set<ManualAvailabilityDTO>(),
  );

  const handleEnterManualMode = () => {
    setInManualMode(true);
  };

  const tableCellColour = (time: Date, date: Date) => {
    const { userAvailable, othersAvailable } = isAvailable(time, date, userAvailability, othersAvailability);

    if (userAvailable && othersAvailable) return `${styles.userAvailable} ${styles.othersAvailable}`;
    if (userAvailable) return styles.userAvailable;
    if (othersAvailable) return styles.othersAvailable;
    return '';
  };

  const hourClass = (time: Date) => {
    if (time.getMinutes() === 0) return styles.hour;
    return '';
  };

  const handleCellClick = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, time: Date, date: Date) => {
    if (inManualMode) {
      // Changes colour of cell
      e.currentTarget.classList.toggle(styles.userAvailable);

      // Handling maintaining state of manual availability
      const { cellStartDateTime, cellEndDateTime } = getCell(time, date);
      const availability = userAvailability.find((avail) => avail.start.getTime() === cellStartDateTime.getTime());

      let newAvailable = false;
      if (availability) {
        newAvailable = !availability.available;
        availability.available = newAvailable;
      }

      const cell: ManualAvailabilityDTO = {
        start: cellStartDateTime,
        end: cellEndDateTime,
        available: newAvailable,
      };
      const tempManualAvailabilties = new Set(manualAvailabilities);

      for (const avail of Array.from(tempManualAvailabilties)) {
        if (avail.start.getTime() === cell.start.getTime()) {
          avail.available = newAvailable;
          setManualAvailabilities(tempManualAvailabilties);
          return;
        }
      }
      tempManualAvailabilties.add(cell);
      setManualAvailabilities(tempManualAvailabilties);
    }
  };

  const handleSave = () => {
    setInManualMode(false);
    if (manualAvailabilities.size) {
      onManualSave(Array.from(manualAvailabilities));
      setManualAvailabilities(new Set<ManualAvailabilityDTO>());
    }
  };

  return (
    <>
      <TableContainer component={Paper} className={styles.table}>
        <Table stickyHeader className={styles.tableContent}>
          <TableHead>
            <TableRow className={styles.headerRow} key={rowKey++}>
              <TableCell className={styles.time} key={cellKey++}>
                Time
              </TableCell>
              {Array.from(dates.keys()).map((date) => (
                <TableCell align="center" className={styles.dates} key={cellKey++}>
                  {date}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ '.MuiTableCell-root': { padding: '0.2em 1em' } }}>
            {Array.from(times.keys()).map((time) => (
              <TableRow key={rowKey++}>
                <TableCell
                  className={`${styles.leftCol} ${hourClass(times.get(time) as Date)}`}
                  align="left"
                  component="th"
                  scope="row"
                  key={cellKey++}
                >
                  {time}
                </TableCell>
                {Array.from(dates.keys()).map((date) => (
                  <TableCell
                    className={`${styles.cell} ${tableCellColour(
                      times.get(time) as Date,
                      dates.get(date) as Date,
                    )} ${hourClass(times.get(time) as Date)}`}
                    key={cellKey++}
                    data-testid={tableCellColour(times.get(time) as Date, dates.get(date) as Date)}
                    onClick={(e) => handleCellClick(e, times.get(time) as Date, dates.get(date) as Date)}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.tableFooter}>
        <Legend />
        {userInFlock ? (
          inManualMode ? (
            <>
              <div className={styles.manualMode}>
                <div className={styles.backgroundIsolation}></div>

                <div className={styles.save}>
                  <Button color="white" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.addManualAvailability}>
              <Button variant="outlined" onClick={handleEnterManualMode}>
                Add manual availabilities
              </Button>
            </div>
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Timematcher;
