import { useQuery } from '@apollo/client';
import React from 'react';
import Timematcher from '../../components/Timematcher';
import SidebarLayout from '../../layouts/SidebarLayout';
import TitleLayout from '../../layouts/TitleLayout';
import styles from './CalendarView.module.css';
import {
  GET_USER_FLOCK,
  GetCurrentFlockResult,
  GET_FLOCK_PARTICIPANTS,
  GET_USER_CALENDARS,
  GetCurrentUserResult,
} from '../../apollo';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import ParticipantList from '../../components/ParticipantList';
import Line from '../../components/Line';
import { UserAvailabilityPartialDTO } from '@flocker/api-types';
import CalendarList from '../../components/CalendarList';

type FlockParams = {
  flockCode: string;
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

  const errorMessage = <>Sorry, we couldn't get your meeting :(</>;
  if (loadingFlock) return <CircularProgress />;
  if (errorFlock) return errorMessage;

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

const CalendarViewSidebar: React.FC = () => {
  const { flockCode } = useParams<FlockParams>();
  const {
    loading: loadingParticipants,
    error: participantsError,
    data: participantsData,
  } = useQuery<GetCurrentFlockResult>(GET_FLOCK_PARTICIPANTS, {
    variables: { flockCode: flockCode },
  });
  const {
    loading: loadingCalendars,
    error: calendarsError,
    data: calendarsData,
  } = useQuery<GetCurrentUserResult>(GET_USER_CALENDARS);
  const errorMessage = <>Sorry, we couldn't get the participants of the meeting :(</>;
  if (loadingParticipants || loadingCalendars) return <CircularProgress />;
  if (participantsError || calendarsError) return errorMessage;

  type Participant = {
    id: string;
    name: string;
  };

  let participants: Participant[] = [];

  if (participantsData) {
    const { users } = participantsData.getFlockByCode;
    users.forEach(function (user) {
      const { id, name } = user;
      participants.push({ id, name });
    });
  }

  type Calendar = {
    name: string;
    id: string;
    enabled: boolean;
    onEnabledChanged: (enabled: boolean) => void;
  };

  let calendars: Calendar[] = [];
  if (calendarsData) {
    const { flocks, availability } = calendarsData.getCurrentUser;
    const userAvailabilityForFlock = flocks.filter((flock) => flock.flockCode === flockCode)[0].userFlockAvailability;

    availability.forEach(function (availability) {
      const { id, name } = availability as UserAvailabilityPartialDTO;
      let isEnabled = false;
      const availabilityForFlock = userAvailabilityForFlock.filter(
        (userAvailability) => userAvailability.userAvailability === availability,
      );
      if (availabilityForFlock) {
        const enabled = true;
        isEnabled = enabled;
      }

      calendars.push({ name, id, enabled: isEnabled, onEnabledChanged: () => {} });
    });
  }

  return (
    <div>
      <h1 className={styles.sidebarHeadings}>Participants</h1>
      <ParticipantList participants={participants} />
      <Line />
      <h1 className={styles.sidebarHeadings}>Calendars</h1>
      <CalendarList calendars={calendars} onUpdate={() => {}} />
    </div>
  );
};

const CalendarView: React.FC = () => <SidebarLayout sidebarContent={<CalendarViewSidebar />} bodyContent={<Flock />} />;

export default CalendarView;
