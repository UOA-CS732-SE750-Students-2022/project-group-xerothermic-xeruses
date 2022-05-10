import { useQuery } from '@apollo/client';
import React from 'react';
import Sidebar from '../../components/Sidebar';
import Timematcher from '../../components/Timematcher';
import SidebarLayout from '../../layouts/SidebarLayout';
import TitleLayout from '../../layouts/TitleLayout';
import styles from './CalendarView.module.css';
import { GET_USER_FLOCK, GetCurrentFlockResult, GET_USER_FLOCK_NAME } from '../../apollo';
import { CircularProgress } from '@mui/material';

type CalendarsProps = {
  flockId: string;
};

const Calendars: React.FC<CalendarsProps> = () => {
  const { loading, error, data } = useQuery<GetCurrentFlockResult>(GET_USER_FLOCK, {
    variables: { getFlockId: flockId },
  });
  const errorMessage = <>Sorry, we couldn't get your meeting :(</>;
  if (loading) return <CircularProgress />;
  if (error) return errorMessage;
  if (data) {
    const { flockDays, users, userFlockAvailability } = data.getFlock;
  }
  return (
    <Timematcher datesPicked={[]} timeRange={[new Date(), new Date()]} userAvailability={[]} othersAvailability={[]} />
  );
};

const Flock: React.FC = () => {
  const { loading, error, data } = useQuery<GetCurrentFlockResult>(GET_USER_FLOCK_NAME);
  const errorMessage = <>Sorry, we couldn't get your meeting :(</>;
  if (loading) return <CircularProgress />;
  if (error) return errorMessage;
  let flockName = '';
  if (data) {
    const { name } = data.getFlock;
    flockName = name;
  }
  return <TitleLayout title={flockName} content={<Calendars flockId="" />} />;
};

const CalendarView: React.FC = () => <SidebarLayout sidebarContent={<Sidebar />} bodyContent={<Flock />} />;

export default CalendarView;
