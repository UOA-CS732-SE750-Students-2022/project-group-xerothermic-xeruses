import { useState } from 'react';
import styles from './Timepicker.module.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type TimepickerProps = {
  label: string;
  defaultValue?: string;
  timeChanged: (date: Date) => void;
};

/* Generates all 24 hours in 12 hour format with AM/PM */
function getHours() {
  const hours = new Map<string, Date>();

  for (let i = 0; i < 24; i++) {
    const ampm = i >= 12 ? 'pm' : 'am';
    const timeString = i > 12 ? `${i - 12}:00 ${ampm}` : `${i}:00 ${ampm}`;
    const timeAsDate = new Date(0, 0, 0, i, 0, 0, 0);
    hours.set(timeString, timeAsDate);
  }

  return hours;
}

const Timepicker = ({ label, timeChanged, defaultValue }: TimepickerProps) => {
  const [time, setTime] = useState(defaultValue ?? '');
  const hours = getHours();

  const handleChange = (event: SelectChangeEvent) => {
    const timeString = event.target.value as string;
    setTime(timeString);
    timeChanged(hours.get(timeString) as Date);
  };

  return (
    <div>
      <FormControl variant="standard" className={styles.select}>
        <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
        <Select
          role="menu"
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={time}
          onChange={handleChange}
        >
          {Array.from(hours.keys()).map((hour) => (
            <MenuItem role="menuitem" value={hour} key={hour}>
              {hour}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default Timepicker;
