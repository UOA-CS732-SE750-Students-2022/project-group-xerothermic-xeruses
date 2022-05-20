import React from 'react';
import styles from './CalendarList.module.css';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup } from '@mui/material';

type CalendarListProps = {
  calendars: Calendar[];
  disabled: boolean;
  onUpdate?: (calendars: Calendar[]) => void;
};

type Calendar = {
  name: string;
  id: string;
  enabled: boolean;
  onEnabledChanged: (id: string, enabled: boolean) => void;
};

const CalendarList: React.FC<CalendarListProps> = ({ calendars, disabled, onUpdate = () => {} }) => {
  const handleChange = (checked: boolean, calendar: Calendar) => {
    calendar.enabled = checked;
    calendar.onEnabledChanged(calendar.id, checked);
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
                  '&.Mui-disabled': {
                    color: 'white',
                    opacity: '50%',
                  },
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e.target.checked, calendar);
                }}
                defaultChecked={calendar.enabled}
                disabled={disabled}
              />
            }
            sx={{
              '&.MuiFormControlLabel-root .MuiFormControlLabel-label.Mui-disabled': {
                color: 'white',
                opacity: '50%',
              },
            }}
            label={<p className={styles.calendarName}>{calendar.name}</p>}
          />
        );
      })}
    </FormGroup>
  );
};

export default CalendarList;
