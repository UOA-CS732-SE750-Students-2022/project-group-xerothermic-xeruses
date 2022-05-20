import React from 'react';
import styles from './ParticipantList.module.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
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
        <ListItem className={styles.listItem} key={participant.id}>
          <Avatar className={styles.avatar}>
            <p className={styles.avatarText}>{getFirstLetter(participant.name)}</p>
          </Avatar>
          <ListItemText primary={<p className={styles.name}>{participant.name}</p>} />
        </ListItem>
      ))}
    </List>
  </div>
);

export default ParticipantList;
