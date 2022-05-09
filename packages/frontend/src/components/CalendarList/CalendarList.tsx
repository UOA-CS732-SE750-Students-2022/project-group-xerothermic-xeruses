import React from 'react';
import styles from './CalendarList.module.css';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup } from '@mui/material';

type CalendarListProps = {
  calendars: Calendar[];
  onUpdate: (calendars: Calendar[]) => void;
};

type Calendar = {
  name: string;
  id: string;
  enabled: boolean;
  onEnabledChanged: (enabled: boolean) => void;
};

const CalendarList: React.FC<CalendarListProps> = ({ calendars, onUpdate }) => {
  const handleChange = (checked: boolean, calendar: Calendar) => {
    calendar.enabled = checked;
    calendar.onEnabledChanged(checked);
    onUpdate(calendars);
  };

  return (
    <FormGroup>
      {calendars.map((calendar) => {
        return (
          <FormControlLabel
            key={calendar.id}
            className={styles.calendarList}
            control={
              <Checkbox
                sx={{
                  color: 'white',
                  '&.Mui-checked': {
                    color: 'white',
                  },
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e.target.checked, calendar);
                }}
              />
            }
            label={calendar.name}
          />
        );
      })}
    </FormGroup>
  );
};

export default CalendarList;
