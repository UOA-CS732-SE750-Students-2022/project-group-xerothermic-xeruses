import React from 'react';
import styles from './ParticipantList.module.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

type ParticipantListProps = {
  participants: Participant[] | Participant;
};

type Participant = {
  name: string;
  id: string;
};

const getFirstLetter = (participant: string) => {
  return participant.charAt(0).toUpperCase();
};

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => (
  <div className={styles.participantList}>
    <List className={styles.listContent}>
      {Array.from(participants as Participant[]).map((participant) => (
        <ListItem key={participant.id}>
          <ListItemAvatar>
            <Avatar className={`${styles.avatar}`}>{getFirstLetter(participant.name)}</Avatar>
          </ListItemAvatar>
          <ListItemText className={styles.name} primary={`${participant.name}`} />
        </ListItem>
      ))}
    </List>
  </div>
);

export default ParticipantList;
