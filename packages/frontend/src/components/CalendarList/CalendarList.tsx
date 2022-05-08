import React from 'react';
import styles from './CalendarList.module.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

type CalendarListProps = {
  calendars: Calendar[];
  intialSelectedCalendars: Calendar[];
  getSelectedCalendars: (calendars: Calendar[]) => void;
};

type Calendar = {
  name: string;
  id: string;
};

const CalendarList: React.FC<CalendarListProps> = ({ calendars, intialSelectedCalendars, getSelectedCalendars }) => {
  const [checked, setChecked] = React.useState<Calendar[]>(intialSelectedCalendars);

  const selectedCalendars = [...checked];

  const handleToggle = (calendar: Calendar) => () => {
    const currentIndex = checked.indexOf(calendar);

    if (currentIndex === -1) {
      selectedCalendars.push(calendar);
    } else {
      selectedCalendars.splice(currentIndex, 1);
    }

    setChecked(selectedCalendars);
    getSelectedCalendars(selectedCalendars);
  };

  console.log(selectedCalendars);
  return (
    <List sx={{ width: '100%', maxWidth: 360 }}>
      {calendars.map((calendar) => {
        return (
          <ListItem key={calendar.id} disablePadding>
            <ListItemButton role={undefined} onClick={handleToggle(calendar)} dense>
              <ListItemIcon>
                <Checkbox edge="start" checked={checked.indexOf(calendar) !== -1} tabIndex={-1} disableRipple />
              </ListItemIcon>
              <ListItemText id={calendar.id + calendar.name} primary={'hi'} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CalendarList;
