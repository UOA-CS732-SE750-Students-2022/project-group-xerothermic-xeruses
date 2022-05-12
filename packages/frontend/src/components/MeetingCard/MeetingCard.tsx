import React from 'react';
import styles from './MeetingCard.module.css';

type MeetingCardProps = {
  title: string;
  numParticipants: number;
  dateRange: [Date, Date];
  onClick?: React.MouseEventHandler;
};

const computeDateString = (date: Date): string =>
  date.toLocaleString(navigator.language, { day: 'numeric', month: 'short', year: 'numeric' });

const MeetingCard: React.FC<MeetingCardProps> = ({ title, numParticipants, dateRange, onClick }) => (
  <div className={styles.container} onClick={onClick}>
    <p className={styles.title}>{title}</p>
    <p className={styles.participants}>
      {numParticipants} {numParticipants === 1 ? 'participant' : 'participants'}
    </p>
    <p className={styles.dates}>
      {computeDateString(dateRange[0])} - {computeDateString(dateRange[1])}
    </p>
  </div>
);

export default MeetingCard;
