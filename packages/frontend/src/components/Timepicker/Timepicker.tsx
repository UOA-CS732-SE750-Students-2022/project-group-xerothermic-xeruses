import { useState } from 'react';
import styles from './Timepicker.module.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type TimepickerProps = {
  label: string;
};

/* Generates all 24 hours in 12 hour format with AM/PM */
function getHours() {
  const hours = [];
  const date = new Date(new Date().setHours(0, 0, 0, 0));

  for (let i = 0; i < 24; i++) {
    const ampm = date.getHours() + i >= 12 ? 'pm' : 'am';
    date.getHours() + i > 12
      ? (hours[i] = `${date.getHours() + i - 12} ${ampm}`)
      : (hours[i] = `${date.getHours() + i} ${ampm}`);
  }
  return hours;
}

const Timepicker = ({ label }: TimepickerProps, timeChanged: (date: Date) => Date) => {
  const [time, setTime] = useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setTime(event.target.value as string);
    const timeAsDate = new Date(new Date().setHours(parseInt(event.target.value.charAt(0)), 0, 0, 0));
    timeChanged(timeAsDate);
  };

  timeChanged = (date: Date): Date => {
    return new Date(date);
  };

  const hours = getHours();

  return (
    <div>
      <FormControl variant="standard" className={`${styles.select}`}>
        <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
        <Select
          role={'menu'}
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={time}
          onChange={handleChange}
        >
          {hours.map((hour) => (
            <MenuItem role={'menuitem'} value={hour} key={hour}>
              {hour}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default Timepicker;
