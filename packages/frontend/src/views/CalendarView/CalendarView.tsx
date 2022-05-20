import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
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
import Button from '../../components/Button';

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

const Participants: React.FC<{ flockCode: string }> = ({ flockCode }) => {
  const participants = useQuery<GetCurrentFlockResult, GetFlockInput>(GET_FLOCK_PARTICIPANTS, {
    variables: { flockCode },
  });
  const participantList: Participant[] = (participants.data?.getFlockByCode?.users ?? []).map(({ id, name }) => ({
    id,
    name,
  }));

  if (participants.loading) return <CircularProgress />;
  if (participants.error) return <p>Sorry, an error occured</p>;
  return <ParticipantList participants={participantList} />;
};

const CalendarView: React.FC = () => {
  const { flockCode } = useParams<FlockParams>();

  const [updateCalendarEnablement] = useMutation<UpdateCalendarEnablementResult, UpdateCalendarEnablementInput>(
    UPDATE_CALENDAR_ENABLEMENT,
  );

  const [userInFlock, setUserInFlock] = useState<boolean>(false);
  const [calendarList, setCalendarList] = useState<Calendar[]>([]);
  const [availabilityIds, setAvailabilityIds] = useState<Set<string>>(new Set<string>());
  const [availabilityIdsReady, setAvailibilityIdsReady] = useState<boolean>(false);
  const onEnabledChanged = async (id: string, enabled: boolean) => {
    setAvailibilityIdsReady(false);
    await updateCalendarEnablement({
      variables: {
        flockCode: flockCode as string,
        userFlockAvailabilityInput: { userAvailabilityId: id, enabled },
      },
    });
    setAvailibilityIdsReady(true);
  };

  const calendars = useQuery<GetCurrentUserResult>(GET_USER_CALENDARS, {
    onCompleted: (data) => {
      const { availability, flocks } = data.getCurrentUser;
      const userAvailabilityForFlock = flocks.find((flock) => flock.flockCode === flockCode)?.userFlockAvailability;
      setUserInFlock(!!userAvailabilityForFlock);

      const tempCalList: Calendar[] = [];
      const tempAvailabilityIds: Set<string> = new Set<string>();
      availability.forEach((avail) => {
        const { id, name } = avail as UserAvailabilityPartialDTO;
        const availabilityForFlock = userAvailabilityForFlock?.find(
          (userAvailability) => (userAvailability.userAvailability as UserAvailabilityPartialDTO).id === id,
        );

        const enabled = !!availabilityForFlock?.enabled;
        tempCalList.push({ id, name, enabled, onEnabledChanged: (id, enabled) => onEnabledChanged(id, enabled) });
        if (enabled) tempAvailabilityIds.add(id);
      });

      setCalendarList(tempCalList);
      setAvailabilityIds(tempAvailabilityIds);
      setAvailibilityIdsReady(true);
    },
  });

  const [flockName, setFlockName] = useState<string>('');
  const [datesPicked, setDatesPicked] = useState<Date[]>([]);
  const [timeRange, setTimeRange] = useState<[Date, Date]>([new Date(), new Date()]);
  const [intervals, setIntervals] = useState<UserIntervalInputDTO[]>([]);
  const [intervalsReady, setIntervalsReady] = useState<boolean>(false);
  const flock = useQuery<GetCurrentFlockResult, GetFlockInput>(GET_USER_FLOCK, {
    variables: { flockCode: flockCode as string },
    onCompleted: (data) => {
      const { name, flockDays } = data.getFlockByCode;
      setFlockName(name);
      setDatesPicked(flockDays.map((d) => new Date(d.start)));

      const startTime = new Date(flockDays[0].start);
      const endTime = new Date(flockDays[0].end);
      setTimeRange([startTime, endTime]);

      const tempIntervals: UserIntervalInputDTO[] = [];
      flockDays.forEach((day) => {
        let startInterval = new Date(day.start);
        const endInterval = new Date(day.end);
        while (startInterval < endInterval) {
          let endPartialInterval = new Date(startInterval.getTime() + FIFTEEN_MINUTES);
          tempIntervals.push({ start: startInterval, end: endPartialInterval });
          startInterval = endPartialInterval;
        }
      });
      setIntervals(tempIntervals);
      setIntervalsReady(true);
    },
  });

  const [userAvailabilities, setUserAvailabilities] = useState<Availability[]>([]);
  const [getUserIntervals, userIntervals] = useLazyQuery<GetUserIntervalsResult>(GET_USER_INTERVALS, {
    onCompleted: (data) => {
      const { availability } = data.getUserIntervals;
      const tempAvail: Availability[] = [];
      availability.forEach((avail) => {
        const { start, end, available } = avail;
        const startInterval = new Date(start);
        const endInterval = new Date(end);
        tempAvail.push({ start: startInterval, end: endInterval, available });
      });

      setUserAvailabilities(tempAvail);
    },
  });

  const getUserIntervalsCallback = useCallback(() => {
    getUserIntervals({
      variables: {
        flockCode: flockCode,
        availabilityIds: Array.from(availabilityIds),
        userIntervalInput: { intervals },
      },
    });
  }, [flockCode, availabilityIds, intervals, getUserIntervals]);

  useEffect(() => {
    if (userInFlock && availabilityIdsReady && intervalsReady) {
      getUserIntervalsCallback();
    }
  }, [userInFlock, availabilityIdsReady, intervalsReady, getUserIntervalsCallback]);

  const [flockAvailabilities, setFlockAvailabilities] = useState<Availability[]>([]);
  const [getFlockIntervals, flockIntervals] = useLazyQuery<GetFlockIntervalsResult>(GET_FLOCK_INTERVALS, {
    onCompleted: (data) => {
      const flockAvailabilityMap = new Map<Date, boolean>();
      const { availabilities } = data.getUserIntervalsForFlock;

      availabilities.forEach((user) => {
        user.intervals.forEach((interval) => {
          if (flockAvailabilityMap.has(interval.start)) {
            // If even one other person in the flock is not available, it will show as unavailable
            if (flockAvailabilityMap.get(interval.start)) {
              flockAvailabilityMap.set(interval.start, interval.available);
            }
          } else {
            flockAvailabilityMap.set(interval.start, interval.available);
          }
        });
      });

      const tempAvail: Availability[] = [];
      flockAvailabilityMap.forEach((value, key) => {
        const date = new Date(key);
        const end = new Date(date.getTime() + FIFTEEN_MINUTES);
        tempAvail.push({ start: date, end: end, available: value });
      });
      setFlockAvailabilities(tempAvail);
    },
  });

  const getFlockIntervalsCallback = useCallback(
    () =>
      getFlockIntervals({
        variables: {
          flockCode: flockCode,
          flockAvailabilityIntervalInput: { intervals },
        },
      }),
    [flockCode, intervals, getFlockIntervals],
  );

  useEffect(() => {
    if (intervalsReady) getFlockIntervalsCallback();
  }, [intervalsReady, getFlockIntervalsCallback]);

  const [errorText, setErrorText] = useState('');

  const [joinFlock] = useMutation<JoinFlockResult, JoinFlockInput>(JOIN_FLOCK, {
    onCompleted: () => window.location.reload(),
    onError: () => setErrorText("Sorry, we couldn't add you to the meeting"),
  });

  const handleJoinFlock = () => {
    joinFlock({ variables: { flockCode: flockCode as string } });
  };

  const [leaveFlock] = useMutation<LeaveFlockResult, LeaveFlockInput>(LEAVE_FLOCK, {
    onCompleted: () => window.location.reload(),
    onError: () => setErrorText("Sorry, we couldn't remove you from the meeting"),
  });

  const handleLeaveFlock = () => {
    leaveFlock({ variables: { flockCode: flockCode as string } });
  };

  const getUserCalendarsContent = () => {
    if (calendars.loading) return <CircularProgress />;
    if (calendars.error) return <p>Sorry, an error occured</p>;
    return (
      <div>
        {!userInFlock && <p className={styles.joinSidebarFlockPrompt}>Please join flock to add your availabilities</p>}
        <CalendarList
          calendars={calendarList}
          disabled={!userInFlock}
          ids={availabilityIds}
          setIds={setAvailabilityIds}
        />
      </div>
    );
  };

  const getFlockContent = () => {
    if (flock.loading || userIntervals.loading || flockIntervals.loading) return <CircularProgress />;
    if (flock.error || userIntervals.error || flockIntervals.error) return <p>Sorry, an error occured</p>;

    let content;

    if (!userInFlock) {
      content = (
        <div className={styles.joinLeaveFlock}>
          <p>You are not part of this flock</p>
          <Button color="primary" onClick={handleJoinFlock}>
            Join Flock
          </Button>
        </div>
      );
    } else {
      content = (
        <div className={styles.joinLeaveFlock}>
          {errorText && <p>{errorText}</p>}
          <Button color="primary" onClick={handleLeaveFlock}>
            Leave Flock
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.flock}>
        {content}
        <Timematcher
          datesPicked={datesPicked}
          timeRange={timeRange}
          userAvailability={userAvailabilities}
          othersAvailability={flockAvailabilities}
        />
      </div>
    );
  };

  return (
    <SidebarLayout
      returnTo={{ route: '/dashboard', name: 'Dashboard' }}
      sidebarContent={
        <div>
          <h1 className={styles.sidebarHeadings}>Participants</h1>
          <Participants flockCode={flockCode as string} />
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
