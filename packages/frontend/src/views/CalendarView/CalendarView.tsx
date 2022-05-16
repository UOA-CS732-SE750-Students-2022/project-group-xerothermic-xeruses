import { useQuery } from '@apollo/client';
import React from 'react';
import Sidebar from '../../components/Sidebar';
import Timematcher from '../../components/Timematcher';
import SidebarLayout from '../../layouts/SidebarLayout';
import TitleLayout from '../../layouts/TitleLayout';
import styles from './CalendarView.module.css';
import {
  GET_USER_FLOCK,
  GET_USER_FLOCKS,
  GetCurrentUserResult,
  GetCurrentFlockResult,
  GET_FLOCK_PARTICIPANTS,
  GET_USER_CALENDARS,
  GetCurrentUserFlocksResult,
  GET_USER_INTERVALS,
  GetUserIntervalsResult,
} from '../../apollo';
import { UserAvailabilityPartialDTO } from '../../../../api-types';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import ParticipantList from '../../components/ParticipantList';
import Line from '../../components/Line';
import CalendarList from '../../components/CalendarList';

type FlockParams = {
  flockCode: string;
};

type Availability = {
  start: Date;
  end: Date;
  available: boolean;
};

const Flock: React.FC = () => {
  const { flockCode } = useParams<FlockParams>();
  const {
    loading: loadingFlock,
    error: errorFlock,
    data: dataFlock,
  } = useQuery<GetCurrentFlockResult>(GET_USER_FLOCK, {
    variables: { flockCode: flockCode },
  });
  const {
    loading: loadingUserAvailability,
    error: errorUserAvailability,
    data: dataUserAvailability,
  } = useQuery<GetUserIntervalsResult>(GET_USER_INTERVALS);

  const errorMessage = <>Sorry, we couldn't get your meeting :(</>;
  if (loadingFlock || loadingUserAvailability) return <CircularProgress />;
  if (errorFlock || errorUserAvailability) return errorMessage;

  let flockName = '';
  let datesPicked: Date[] = [];
  let timeRange: [Date, Date] = [new Date(), new Date()];
  if (dataFlock) {
    //dates
    const { name, flockDays } = dataFlock.getFlockByCode;
    flockName = name;
    flockDays.forEach(function (day) {
      const date = new Date(day.start);
      datesPicked.push(date);
    });
    //timerange
    const startTime = new Date(flockDays[0].start);
    const endTime = new Date(flockDays[0].end);
    timeRange = [startTime, endTime];
  }

  return (
    <TitleLayout
      title={flockName}
      content={
        <Timematcher datesPicked={datesPicked} timeRange={timeRange} userAvailability={[]} othersAvailability={[]} />
      }
    />
  );
};

const FlockParticipantList: React.FC = () => {
  const { flockCode } = useParams<FlockParams>();
  const { loading, error, data } = useQuery<GetCurrentFlockResult>(GET_FLOCK_PARTICIPANTS, {
    variables: { flockCode: flockCode },
  });
  const errorMessage = <>Sorry, we couldn't get the participants of the meeting :(</>;
  if (loading) return <CircularProgress />;
  if (error) return errorMessage;

  type Participant = {
    id: string;
    name: string;
  };

  let participants: Participant[] = [];

  if (data) {
    const { users } = data.getFlockByCode;
    users.forEach(function (user) {
      const { id, name } = user;
      participants.push({ id, name });
    });
  }

  console.log(participants);

  return <ParticipantList participants={participants} />;
};

const FlockCalendarList: React.FC = () => {
  const { flockCode } = useParams<FlockParams>();
  const { loading, error, data } = useQuery<GetCurrentUserResult>(GET_USER_FLOCKS);
  const errorMessage = <>Sorry, we couldn't get your calendars</>;

  if (loading) return <CircularProgress />;
  if (error) return errorMessage;
  if (data) {
    const { flocks } = data.getCurrentUser;
  }

  type Calendar = {
    id: string;
    name: string;
    enabled: boolean;
    onEnabledChanged: (enabled: boolean) => void;
  };

  let calendars: Calendar[] = [];

  return <CalendarList calendars={calendars} onUpdate={() => {}} />;
};

const CalendarViewSidebar: React.FC = () => {
  return (
    <div>
      <h1 className={styles.sidebarHeadings}>Participants</h1>
      <FlockParticipantList />
      <Line />
      <FlockCalendarList />
      <h1 className={styles.sidebarHeadings}>Calendars</h1>
    </div>
  );
};

const CalendarView: React.FC = () => <SidebarLayout sidebarContent={<CalendarViewSidebar />} bodyContent={<Flock />} />;

export default CalendarView;
