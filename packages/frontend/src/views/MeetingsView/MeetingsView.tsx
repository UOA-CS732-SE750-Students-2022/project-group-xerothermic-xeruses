import React from 'react';
import styles from './MeetingsView.module.css';
import MeetingCard from '../../components/MeetingCard';
import TitleLayout from '../../layouts/TitleLayout';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_FLOCKS, GetCurrentUserResult } from '../../apollo';
import { CircularProgress } from '@mui/material';

const MeetingsList: React.FC = () => {
  // const navigate = useNavigate(); // TODO: Uncomment this when the "create new meeting" view becomes available
  const { loading, error, data } = useQuery<GetCurrentUserResult>(GET_USER_FLOCKS);
  const errorMessage = <>Sorry, we couldn't get your meetings :(</>;

  if (loading) return <CircularProgress />;
  if (error) return errorMessage;
  if (data) {
    const { flocks } = data.getCurrentUser;
    if (flocks.length) {
      return (
        <div className={styles.meetings}>
          {flocks.map((f) => {
            const { name, flockCode } = f;
            const numParticipants = f.users.length;
            const dateRange: [Date, Date] = [
              new Date(f.flockDays[0].start),
              new Date(f.flockDays[f.flockDays.length - 1].end),
            ];

            return (
              <MeetingCard
                title={name}
                numParticipants={numParticipants}
                dateRange={dateRange}
                key={flockCode}
                // onClick={() => navigate(`/meeting/${flockCode}`)} // TODO: Uncomment this when the view becomes available
              />
            );
          })}
        </div>
      );
    }
    return <>You are not part of any meetings</>;
  }
  return errorMessage;
};

const MeetingsView: React.FC = () => <TitleLayout title="My Meetings" content={<MeetingsList />} />;

export default MeetingsView;
