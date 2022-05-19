import { useMutation, useQuery } from '@apollo/client';
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
  UPDATE_CALENDAR_ENABLEMENT,
  UpdateCalendarEnablementResult,
  UpdateCalendarEnablementInput,
  GetFlockInput,
  GET_CURRENT_USER_NAME,
  JoinFlockResult,
  JoinFlockInput,
  JOIN_FLOCK,
  LeaveFlockResult,
  LeaveFlockInput,
  LEAVE_FLOCK,
} from '../../apollo';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import ParticipantList from '../../components/ParticipantList';
import Line from '../../components/Line';
import { UserAvailabilityPartialDTO, UserIntervalInputDTO } from '@flocker/api-types';
import CalendarList from '../../components/CalendarList';
import { start } from 'repl';
import Button from '../../components/Button';
import { errorPrefix } from '@firebase/util';

type Availability = {
  start: Date;
  end: Date;
  available: boolean;
};

type Calendar = {
  name: string;
  id: string;
  enabled: boolean;
  onEnabledChanged: (id: string, enabled: boolean) => void;
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
  datesPicked: Date[];
  timeRange: [Date, Date];
  userAvailability: Availability[];
  othersAvailability: Availability[];
};

const Flock: React.FC<FlockProps> = ({ datesPicked, timeRange, userAvailability, othersAvailability }) => {
  return (
    <div className={styles.timeMatcher}>
      <Timematcher
        datesPicked={datesPicked}
        timeRange={timeRange}
        userAvailability={userAvailability}
        othersAvailability={othersAvailability}
      />
      <Legend />
    </div>
  );
};

const Legend: React.FC = () => {
  return (
    <div>
      <h2>Legend</h2>
      <div className={styles.legendKeys}>
        <div className={`${styles.circleAvailability} ${styles.circleBothAvailable}`} />
        <h3>All available</h3>
        <div className={`${styles.circleAvailability} ${styles.circleUserAvailable}`} />
        <h3>You're available</h3>
        <div className={`${styles.circleAvailability} ${styles.circleFlockAvailable}`} />
        <h3>Others available</h3>
      </div>
    </div>
  );
};

const CalendarView: React.FC = () => {
  let userInFlock = true;

  const { flockCode } = useParams<FlockParams>();

  const flock = useQuery<GetCurrentFlockResult, GetFlockInput>(GET_USER_FLOCK, {
    variables: { flockCode: flockCode as string },
  });

  const user = useQuery<GetCurrentUserResult>(GET_CURRENT_USER_NAME);

  const participants = useQuery<GetCurrentFlockResult, GetFlockInput>(GET_FLOCK_PARTICIPANTS, {
    variables: { flockCode: flockCode as string },
  });
  const calendars = useQuery<GetCurrentUserResult>(GET_USER_CALENDARS);

  const participantList: Participant[] = (participants.data?.getFlockByCode?.users ?? []).map(({ id, name }) => ({
    id,
    name,
  }));

  if (participants.data && user.data) {
    const { users } = participants.data.getFlockByCode;
    const { id } = user.data.getCurrentUser;
    if (!users.find((user) => user.id === id)) {
      userInFlock = false;
    }
  }

  const [updateCalendarEnablement, { reset: updateCalendarEnablementReset }] = useMutation<
    UpdateCalendarEnablementResult,
    UpdateCalendarEnablementInput
  >(UPDATE_CALENDAR_ENABLEMENT, {});

  const handleUpdateCalendarEnablement = (id: string, enabled: boolean) => {
    updateCalendarEnablement({
      variables: {
        flockCode: flockCode || '',
        userFlockAvailabilityInput: { userAvailabilityId: id, enabled: enabled },
      },
    });
    updateCalendarEnablementReset();
  };
  let calendarList: Calendar[] = [];
  let availabilityIds: string[] = [];

  if (calendars.data) {
    const { flocks, availability } = calendars.data.getCurrentUser;
    if (userInFlock) {
      const userAvailabilityForFlock = flocks.filter((flock) => flock.flockCode === flockCode)[0].userFlockAvailability;

      availability.forEach((availability) => {
        const { id, name } = availability as UserAvailabilityPartialDTO;
        const availabilityForFlock = userAvailabilityForFlock.find(
          (userAvailability) => (userAvailability.userAvailability as UserAvailabilityPartialDTO).id === id,
        );
        const enabled = !!availabilityForFlock?.enabled;

        calendarList.push({
          name,
          id,
          enabled,
          onEnabledChanged: handleUpdateCalendarEnablement,
        });

        if (enabled) availabilityIds.push(id);
      });
    } else {
      const { availability } = calendars.data.getCurrentUser;

      availability.forEach((availability) => {
        const { id, name } = availability as UserAvailabilityPartialDTO;

        const enabled = false;

        calendarList.push({
          name,
          id,
          enabled,
          onEnabledChanged: handleUpdateCalendarEnablement,
        });
      });
    }
  }

  let flockName = '';
  let datesPicked: Date[] = [];
  let timeRange: [Date, Date] = [new Date(), new Date()];
  let intervals: UserIntervalInputDTO[] = [];

  if (flock.data) {
    //dates
    const { name, flockDays } = flock.data.getFlockByCode;
    flockName = name;
    datesPicked = flockDays.map((day) => new Date(day.start));
    //timerange
    const startTime = new Date(flockDays[0].start);
    const endTime = new Date(flockDays[0].end);
    timeRange = [startTime, endTime];

    //make intervals which represent every cell
    flockDays.forEach((day) => {
      let startInterval = new Date(day.start);
      const endInterval = new Date(day.end);
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
  if (userInFlock) {
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
  }

  //User and Flock interval queries placed here so availabilityIds and interval data retrieved first
  const userIntervals = useQuery<GetUserIntervalsResult>(GET_USER_INTERVALS, {
    variables: {
      flockCode: flockCode,
      availabilityIds: availabilityIds,
      userIntervalInput: { intervals: intervals },
    },
    skip: !userInFlock,
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
  }

  const flockAvailabilityMap = new Map<Date, boolean>();
  let flockAvailabilityIds: string[] = [];

  if (!userInFlock) {
    if (flock.data) {
      const { userFlockAvailability } = flock.data.getFlockByCode;

      if (userFlockAvailability.length > 0) {
        userFlockAvailability.forEach((flockAvailability) => {
          if (flockAvailability.enabled) {
            const { userAvailability } = flockAvailability;
            const { id } = userAvailability as UserAvailabilityPartialDTO;
            flockAvailabilityIds.push(id);
          }
        });
      }
    }
  }

  const [errorText, setErrorText] = useState('');

  const [joinFlock] = useMutation<JoinFlockResult, JoinFlockInput>(JOIN_FLOCK, {
    // onCompleted: (data) => navigate(`/meeting/${data.joinFlock.flockCode}`), // TODO: Uncomment this when the meeting view becomes available
    onCompleted: () => alert('Successfully created. Meeting view coming soon'), // TODO: Delete this when meeting view becomes available
    onError: () => setErrorText("Sorry, we couldn't add you to the meeting"),
  });

  const handleJoinFlock = () => {
    joinFlock({ variables: { flockCode: flockCode as string } });
  };

  const [leaveFlock] = useMutation<LeaveFlockResult, LeaveFlockInput>(LEAVE_FLOCK, {
    // onCompleted: (data) => navigate(`/meeting/${data.joinFlock.flockCode}`), // TODO: Uncomment this when the meeting view becomes available
    onCompleted: () => alert('Successfully created. Meeting view coming soon'), // TODO: Delete this when meeting view becomes available
    onError: () => setErrorText("Sorry, we couldn't add you to the meeting"),
  });

  const handleLeaveFlock = () => {
    leaveFlock({ variables: { flockCode: flockCode as string } });
  };

  const getParticipantsContent = () => {
    if (participants.loading) return <CircularProgress />;
    if (participants.error) return <p>Sorry, an error occured</p>;
    return <ParticipantList participants={participantList} />;
  };

  const getUserCalendarsContent = () => {
    if (calendars.loading) return <CircularProgress />;
    if (calendars.error) return <p>Sorry, an error occured</p>;
    if (!userInFlock)
      return (
        <div>
          <p className={styles.joinFlockPrompt}>Please join flock to add your availabilities :)</p>
          <CalendarList calendars={calendarList} disabled={true} onUpdate={setUserCalendarList} />
        </div>
      );
    return <CalendarList calendars={calendarList} disabled={false} onUpdate={setUserCalendarList} />;
  };

  const getFlockContent = () => {
    if (flock.loading || userIntervals.loading || flockIntervals.loading) return <CircularProgress />;
    if (flock.error || userIntervals.error || flockIntervals.error) return <p>Sorry, an error occured</p>;
    if (!userInFlock)
      return (
        <div>
          <p className={styles.joinFlockPrompt}>You are not part of this flock</p>
          <div className={styles.joinFlockButton}>
            <Button color="primary" children={'Join Flock'} onClick={handleJoinFlock} />
          </div>
          <Flock
            datesPicked={datesPicked}
            timeRange={timeRange}
            userAvailability={userAvailabilities}
            othersAvailability={flockAvailabilities}
          />
        </div>
      );
    return (
      <div>
        <p className={styles.joinFlockPrompt}>{errorText}</p>
        <Flock
          datesPicked={datesPicked}
          timeRange={timeRange}
          userAvailability={userAvailabilities}
          othersAvailability={flockAvailabilities}
        />
        <div className={styles.leaveFlockButton}>
          <Button color="primary" children={'Leave Flock'} onClick={handleLeaveFlock} />
        </div>
      </div>
    );
  };

  return (
    <SidebarLayout
      sidebarContent={
        <div>
          <h1 className={styles.sidebarHeadings}>Participants</h1>
          {getParticipantsContent()}
          <div className={styles.sidebarDivider}>
            <Line />
          </div>
          <h1 className={styles.sidebarHeadings}>Calendars</h1>
          {getUserCalendarsContent()}
        </div>
      }
      bodyContent={<TitleLayout title={flockName} content={getFlockContent()} />}
    />
  );
};

export default CalendarView;
