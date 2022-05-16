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
  GET_USER_INTERVALS,
  GetUserIntervalsResult,
  GetFlockIntervalsResult,
  GET_FLOCK_INTERVALS,
} from '../../apollo';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import ParticipantList from '../../components/ParticipantList';
import Line from '../../components/Line';
import { UserAvailabilityPartialDTO, UserIntervalInputDTO } from '@flocker/api-types';
import CalendarList from '../../components/CalendarList';
import Button from '../../components/Button';

type FlockParams = {
  flockCode: string;
};

type Availability = {
  start: Date;
  end: Date;
  available: boolean;
};
const FIFTEEN_MINUTES = 15 * 60000;

let availabilityIds: string[] = [];

const Flock: React.FC = () => {
  const { flockCode } = useParams<FlockParams>();
  const flock = useQuery<GetCurrentFlockResult>(GET_USER_FLOCK, {
    variables: { flockCode: flockCode },
  });

  const errorMessage = <>Sorry, we couldn't get your meeting :(</>;

  let flockName = '';
  let datesPicked: Date[] = [];
  let timeRange: [Date, Date] = [new Date(), new Date()];
  let intervals: UserIntervalInputDTO[] = [];
  if (flock.data) {
    //dates
    const { name, flockDays } = flock.data.getFlockByCode;
    flockName = name;
    flockDays.forEach((day) => {
      const date = new Date(day.start);
      datesPicked.push(date);
    });
    //timerange
    const startTime = new Date(flockDays[0].start);
    const endTime = new Date(flockDays[0].end);
    timeRange = [startTime, endTime];

    flockDays.forEach((day) => {
      let startInterval = new Date(day.start);
      let endInterval = new Date(day.end);

      while (startInterval < endInterval) {
        let endPartialInterval = new Date(startInterval.getTime() + FIFTEEN_MINUTES);
        intervals.push({ start: startInterval, end: endPartialInterval });
        startInterval = endPartialInterval;
      }
    });
  }

  const userIntervals = useQuery<GetUserIntervalsResult>(GET_USER_INTERVALS, {
    variables: {
      availabilityIds: availabilityIds,
      userIntervalInput: { intervals: intervals },
    },
  });

  let userAvailabilities: Availability[] = [];
  if (userIntervals.data) {
    const { availability } = userIntervals.data.getUserIntervals;
    availability.forEach((avail) => {
      const { start, end, available } = avail;
      const startInterval = new Date(start);
      const endInterval = new Date(end);
      userAvailabilities.push({ start: startInterval, end: endInterval, available });
    });
  }
  let flockAvailabilities: Availability[] = [];
  const flockIntervals = useQuery<GetFlockIntervalsResult>(GET_FLOCK_INTERVALS, {
    variables: {
      flockCode: flockCode,
      flockAvailabilityIntervalInput: { intervals: intervals },
    },
  });

  if (flockIntervals.data) {
    const flockAvailabilityMap = new Map<Date, boolean>();
    const { availabilities } = flockIntervals.data.getUserIntervalsForFlock;
    if (availabilities.length > 0) {
      availabilities.forEach((user) => {
        user.intervals.forEach((interval) => {
          if (flockAvailabilityMap.has(interval.start)) {
            //If even one other person in the flock is not available, it will show as unavailable
            if (flockAvailabilityMap.get(interval.start)) flockAvailabilityMap.set(interval.start, interval.available);
          }
        });
      });
    }

    flockAvailabilityMap.forEach((value, key) => {
      const end = new Date(key.getTime() + FIFTEEN_MINUTES);
      flockAvailabilities.push({ start: key, end: end, available: value });
    });
  }

  if (flock.loading || userIntervals.loading) return <CircularProgress />;
  if (flock.error) return errorMessage;

  return (
    <TitleLayout
      title={flockName}
      content={
        <>
          <div className={styles.timeMatcher}>
            <Timematcher
              datesPicked={datesPicked}
              timeRange={timeRange}
              userAvailability={userAvailabilities}
              othersAvailability={flockAvailabilities}
            />
          </div>
        </>
      }
    />
  );
};

const CalendarViewSidebar: React.FC = () => {
  const { flockCode } = useParams<FlockParams>();
  const participants = useQuery<GetCurrentFlockResult>(GET_FLOCK_PARTICIPANTS, {
    variables: { flockCode: flockCode },
  });
  const calendars = useQuery<GetCurrentUserResult>(GET_USER_CALENDARS);
  const errorMessage = <>Sorry, we couldn't get the participants of the meeting :(</>;
  if (participants.loading || calendars.loading) return <CircularProgress />;
  if (participants.error || calendars.error) return errorMessage;

  type Participant = {
    id: string;
    name: string;
  };

  let participantList: Participant[] = [];

  if (participants.data) {
    const { users } = participants.data.getFlockByCode;
    users.forEach((user) => {
      const { id, name } = user;
      participantList.push({ id, name });
    });
  }

  type Calendar = {
    name: string;
    id: string;
    enabled: boolean;
    onEnabledChanged: (enabled: boolean) => void;
  };

  let calendarList: Calendar[] = [];
  if (calendars.data) {
    const { flocks, availability } = calendars.data.getCurrentUser;
    const userAvailabilityForFlock = flocks.filter((flock) => flock.flockCode === flockCode)[0].userFlockAvailability;

    availability.forEach((availability) => {
      const { id, name } = availability as UserAvailabilityPartialDTO;
      let isEnabled = false;
      const availabilityForFlock = userAvailabilityForFlock.filter(
        (userAvailability) => userAvailability.userAvailability === availability,
      );
      if (availabilityForFlock) {
        const enabled = true;
        isEnabled = enabled;
      }
      calendarList.push({ name, id, enabled: isEnabled, onEnabledChanged: () => {} });
      availabilityIds.push(id);
    });
  }

  return (
    <div>
      <h1 className={styles.sidebarHeadings}>Participants</h1>
      <ParticipantList participants={participantList} />
      <Line />
      <h1 className={styles.sidebarHeadings}>Calendars</h1>
      <CalendarList calendars={calendarList} onUpdate={() => {}} />
      <Button variant="filled" color="white" onClick={() => {}} />
    </div>
  );
};

const CalendarView: React.FC = () => <SidebarLayout sidebarContent={<CalendarViewSidebar />} bodyContent={<Flock />} />;

export default CalendarView;
