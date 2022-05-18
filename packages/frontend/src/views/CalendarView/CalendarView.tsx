import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
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

type Availability = {
  start: Date;
  end: Date;
  available: boolean;
};

type Calendar = {
  name: string;
  id: string;
  enabled: boolean;
  onEnabledChanged: (enabled: boolean) => void;
};

type Participant = {
  id: string;
  name: string;
};

type FlockParams = {
  flockCode: string;
};

const FIFTEEN_MINUTES = 15 * 60000;

type FlockProps = {
  flockName: string;
  datesPicked: Date[];
  timeRange: [Date, Date];
  userAvailability: Availability[];
  othersAvailability: Availability[];
};

const Flock: React.FC<FlockProps> = ({ flockName, datesPicked, timeRange, userAvailability, othersAvailability }) => {
  return (
    <TitleLayout
      title={flockName}
      content={
        <>
          <div className={styles.timeMatcher}>
            <Timematcher
              datesPicked={datesPicked}
              timeRange={timeRange}
              userAvailability={userAvailability}
              othersAvailability={othersAvailability}
            />
            <Legend />
          </div>
        </>
      }
    />
  );
};

const Legend: React.FC = () => {
  return (
    <div>
      <h2>Legend</h2>
      <div className={styles.legendKeys}>
        <div className={(styles.circleAvailability, styles.circleBothAvailable)} />
        <h3>All available</h3>
        <div className={(styles.circleAvailability, styles.circleUserAvailable)} />
        <h3>You're available</h3>
        <div className={(styles.circleAvailability, styles.circleFlockAvailable)} />
        <h3>Others available</h3>
      </div>
    </div>
  );
};

const CalendarView: React.FC = () => {
  const { flockCode } = useParams<FlockParams>();

  const flock = useQuery<GetCurrentFlockResult>(GET_USER_FLOCK, {
    variables: { flockCode: flockCode },
  });

  const participants = useQuery<GetCurrentFlockResult>(GET_FLOCK_PARTICIPANTS, {
    variables: { flockCode: flockCode },
  });
  const calendars = useQuery<GetCurrentUserResult>(GET_USER_CALENDARS);

  let participantList: Participant[] = [];
  if (participants.data) {
    const { users } = participants.data.getFlockByCode;
    users.forEach((user) => {
      const { id, name } = user;
      participantList.push({ id, name });
    });
  }

  let calendarList: Calendar[] = [];
  let availabilityIds: string[] = [];
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
        isEnabled = true;
      }
      calendarList.push({ name, id, enabled: isEnabled, onEnabledChanged: () => {} });
      availabilityIds.push(id);
    });
  }

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

    //make intervals which represent every cell
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

  let userCalendars: Calendar[] = [];
  let userAvailabilities: Availability[] = [];
  const [userCalendarList, setUserCalendarList] = useState(userCalendars);

  if (userCalendarList) {
    userCalendarList.forEach((calendar) => {
      if (calendar.enabled === false) {
        if (availabilityIds.includes(calendar.id)) {
          availabilityIds = availabilityIds.filter((id) => id !== calendar.id);
        }
      } else {
        if (!availabilityIds.includes(calendar.id)) {
          availabilityIds.push(calendar.id);
        }
      }
    });
  }

  //User and Flock interval queries placed here so availabilityIds and interval data retrieved first
  const userIntervals = useQuery<GetUserIntervalsResult>(GET_USER_INTERVALS, {
    variables: {
      flockCode: flockCode,
      availabilityIds: availabilityIds,
      userIntervalInput: { intervals: intervals },
    },
  });

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
            if (flockAvailabilityMap.get(interval.start)) {
              flockAvailabilityMap.set(interval.start, interval.available);
            }
          } else {
            flockAvailabilityMap.set(interval.start, interval.available);
          }
        });
      });
    }

    flockAvailabilityMap.forEach((value, key) => {
      const date = new Date(key);
      const end = new Date(date.getTime() + FIFTEEN_MINUTES);
      flockAvailabilities.push({ start: date, end: end, available: value });
    });

    console.log(flockAvailabilities);
  }

  const errorMessage = <>Sorry, we couldn't get your meeting :(</>;
  if (participants.loading || calendars.loading) return <CircularProgress />;
  if (participants.error || calendars.error) return errorMessage;

  if (flock.loading || userIntervals.loading) return <CircularProgress />;
  if (flock.error) return errorMessage;

  return (
    <SidebarLayout
      sidebarContent={
        <div>
          <h1 className={styles.sidebarHeadings}>Participants</h1>
          <ParticipantList participants={participantList} />
          <Line />
          <h1 className={styles.sidebarHeadings}>Calendars</h1>
          <CalendarList calendars={calendarList} onUpdate={() => setUserCalendarList(calendarList)} />
        </div>
      }
      bodyContent={
        <Flock
          flockName={flockName}
          datesPicked={datesPicked}
          timeRange={timeRange}
          userAvailability={userAvailabilities}
          othersAvailability={flockAvailabilities}
        />
      }
    />
  );
};

export default CalendarView;
