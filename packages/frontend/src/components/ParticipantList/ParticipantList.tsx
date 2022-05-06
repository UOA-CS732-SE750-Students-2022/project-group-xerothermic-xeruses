import React from 'react';
import styles from './ParticipantList.module.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

type ParticipantListProps = {
  participants: string[];
};

const generate = (element: React.ReactElement) => {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
};

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => (
  <div>
    <h1 className={styles.title}>Participants</h1>
    <List dense={true}>
      {generate(
        <ListItem>
          <ListItemAvatar>
            <Avatar></Avatar>
          </ListItemAvatar>
          <ListItemText primary="participant-name" />
        </ListItem>,
      )}
    </List>
  </div>
);

export default ParticipantList;
