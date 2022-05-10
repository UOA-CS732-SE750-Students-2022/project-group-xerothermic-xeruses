import { useQuery } from '@apollo/client';
import React from 'react';
import Sidebar from '../../components/Sidebar';
import Timematcher from '../../components/Timematcher';
import SidebarLayout from '../../layouts/SidebarLayout';
import TitleLayout from '../../layouts/TitleLayout';
import styles from './CalendarView.module.css';
import {
  GET_USER_FLOCK,
  GetCurrentFlockResult,
  GET_USER_FLOCK_NAME,
  GET_FLOCK_PARTICIPANTS,
  GetFlockParticipantResult,
  GET_USER_CALENDARS,
  GetCurrentUserCalendarsResult,
} from '../../apollo';
import { UserAvailabilityPartialDTO } from '../../../../api-types';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import ParticipantList from '../../components/ParticipantList';
import Line from '../../components/Line';
import CalendarList from '../../components/CalendarList';

type CalendarsProps = {
  flockId: string;
};

const Calendars: React.FC<CalendarsProps> = () => {
  const { loading, error, data } = useQuery<GetCurrentFlockResult>(GET_USER_FLOCK, {});
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
  type FlockParams = {
    flockId: string;
  };
  const { flockId } = useParams<FlockParams>();

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

const FlockParticipantList: React.FC = () => {
  const { loading, error, data } = useQuery<GetFlockParticipantResult>(GET_FLOCK_PARTICIPANTS);
  const errorMessage = <>Sorry, we couldn't get the participants of the meeting :(</>;
  if (loading) return <CircularProgress />;
  if (error) return errorMessage;

  type Participant = {
    id: string;
    name: string;
  };

  let participants: Participant[] = [];

  if (data) {
    const { users } = data.getParticipants;
    users.forEach(function (user) {
      const { id, name } = user;
      participants.push({ id, name });
    });
  }

  return <ParticipantList participants={participants} />;
};

const FlockCalendarList: React.FC = () => {
  const { loading, error, data } = useQuery<GetCurrentUserCalendarsResult>(GET_USER_CALENDARS);
  const errorMessage = <>Sorry, we couldn't get your calendars :(</>;
  if (loading) return <CircularProgress />;
  if (error) return errorMessage;

  type Calendar = {
    id: string;
    name: string;
    enabled: boolean;
    onEnabledChanged: (enabled: boolean) => void;
  };

  let calendars: Calendar[] = [];

  if (data) {
    const { userFlockAvailability } = data.getUserFlockAvailability;
    userFlockAvailability.forEach(function (calendar) {
      const { enabled } = calendar;
      const { id, name } = calendar.userAvailability as UserAvailabilityPartialDTO;
      calendars.push({ id, name, enabled, onEnabledChanged: () => {} });
    });
  }

  return <CalendarList calendars={calendars} onUpdate={() => {}} />;
};

const CalendarViewSidebar: React.FC = () => {
  //Participants list

  //Calendars list

  //Import calendar

  return (
    <Sidebar>
      <FlockParticipantList />
      <Line />
      <FlockCalendarList />
    </Sidebar>
  );
};

const CalendarView: React.FC = () => <SidebarLayout sidebarContent={<CalendarViewSidebar />} bodyContent={<Flock />} />;

export default CalendarView;
