import React from 'react';
import styles from './ParticipantList.module.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

type ParticipantListProps = {
  participants: Participant[];
};

type Participant = {
  name: string;
  id: string;
};

const getFirstLetter = (participant: string) => {
  return participant.charAt(0).toUpperCase();
};

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  if (!participants.length) {
    return <p className={styles.noParticipants}>Join to be the first in this flock!</p>;
  }
  return (
    <div className={styles.participantList}>
      <List className={styles.listContent}>
        {participants.map((participant) => (
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
};

export default ParticipantList;
