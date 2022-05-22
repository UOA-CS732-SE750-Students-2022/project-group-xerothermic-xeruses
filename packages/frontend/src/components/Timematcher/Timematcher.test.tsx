import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import Timematcher from './Timematcher';

it('should render', () => {
  const time1 = new Date('05/04/2022');
  time1.setHours(9, 0, 0, 0);

  const time2 = new Date('05/04/2022');
  time2.setHours(9, 15, 0, 0);

  type Availability = {
    start: Date;
    end: Date;
    available: boolean;
  };

  const freeTime1: Availability = {
    start: time1,
    end: time2,
    available: true,
  };

  const freeTimes = [freeTime1];

  const { container } = render(
    <Timematcher
      datesPicked={[new Date('05/04/2022')]}
      timeRange={[time1, time2]}
      userAvailability={freeTimes}
      othersAvailability={freeTimes}
      userInFlock
    />,
  );
  expect(container).toBeVisible();
});

it('should render multiple dates', () => {
  const time1 = new Date('05/04/2022');
  time1.setHours(9, 0, 0, 0);

  const time2 = new Date('05/05/2022');
  time2.setHours(9, 0, 0, 0);

  type Availability = {
    start: Date;
    end: Date;
    available: boolean;
  };

  const freeTime1: Availability = {
    start: time1,
    end: time1,
    available: true,
  };
  const freeTime2: Availability = {
    start: time2,
    end: time2,
    available: true,
  };

  const freeTimes = [freeTime1, freeTime2];

  render(
    <Timematcher
      datesPicked={[new Date('05/04/2022'), new Date('05/05/2022')]}
      timeRange={[time1, time1]}
      userAvailability={freeTimes}
      othersAvailability={freeTimes}
      userInFlock
    />,
  );

  const date1 = screen.getByText(/Wed, May 4/i);
  const date2 = screen.getByText(/Thu, May 5/i);
  expect(date1).toBeVisible();
  expect(date2).toBeVisible();
});

it('should render multiple times', () => {
  const time1 = new Date('05/04/2022');
  time1.setHours(9, 0, 0, 0);

  const time2 = new Date('05/04/2022');
  time2.setHours(9, 15, 0, 0);

  const time3 = new Date('05/04/2022');
  time3.setHours(9, 30, 0, 0);

  type Availability = {
    start: Date;
    end: Date;
    available: boolean;
  };

  const freeTime1: Availability = {
    start: time1,
    end: time2,
    available: true,
  };

  const freeTime2: Availability = {
    start: time2,
    end: time3,
    available: true,
  };

  const freeTimes = [freeTime1, freeTime2];

  render(
    <Timematcher
      datesPicked={[new Date('05/04/2022')]}
      timeRange={[time1, time3]}
      userAvailability={freeTimes}
      othersAvailability={freeTimes}
      userInFlock
    />,
  );

  const date1 = screen.getByText(/9:00 am/i);
  const date2 = screen.getByText(/9:15 am/i);
  expect(date1).toBeVisible();
  expect(date2).toBeVisible();
});

it('should show both available cell when both user and others are available', () => {
  const time1 = new Date('05/04/2022');
  time1.setHours(9, 0, 0, 0);

  type Availability = {
    start: Date;
    end: Date;
    available: boolean;
  };

  const freeTime1: Availability = {
    start: time1,
    end: time1,
    available: true,
  };

  const freeTimes = [freeTime1];

  render(
    <Timematcher
      datesPicked={[new Date('05/04/2022')]}
      timeRange={[time1, time1]}
      userAvailability={freeTimes}
      othersAvailability={freeTimes}
      userInFlock
    />,
  );

  const bothAvailable = screen.getAllByTestId('userAvailable othersAvailable');
  expect(bothAvailable).toHaveLength(1);
});

it('should show user available cell when user is available but others are not', () => {
  const time1 = new Date('05/04/2022');
  time1.setHours(9, 0, 0, 0);

  type Availability = {
    start: Date;
    end: Date;
    available: boolean;
  };

  const userFreeTime: Availability = {
    start: time1,
    end: time1,
    available: true,
  };
  const othersNotFreeTIme: Availability = {
    start: time1,
    end: time1,
    available: false,
  };

  const userAvailabilities = [userFreeTime];
  const othersAvailabilities = [othersNotFreeTIme];

  render(
    <Timematcher
      datesPicked={[new Date('05/04/2022')]}
      timeRange={[time1, time1]}
      userAvailability={userAvailabilities}
      othersAvailability={othersAvailabilities}
      userInFlock
    />,
  );

  const userAvailable = screen.getAllByTestId('userAvailable');
  expect(userAvailable).toHaveLength(1);
});

it('should show others available cell when others are available but user is not', () => {
  const time1 = new Date('05/04/2022');
  time1.setHours(9, 0, 0, 0);

  type Availability = {
    start: Date;
    end: Date;
    available: boolean;
  };

  const userNotFreeTime: Availability = {
    start: time1,
    end: time1,
    available: false,
  };
  const othersFreeTIme: Availability = {
    start: time1,
    end: time1,
    available: true,
  };

  const userAvailabilities = [userNotFreeTime];
  const othersAvailabilities = [othersFreeTIme];

  render(
    <Timematcher
      datesPicked={[new Date('05/04/2022')]}
      timeRange={[time1, time1]}
      userAvailability={userAvailabilities}
      othersAvailability={othersAvailabilities}
      userInFlock
    />,
  );

  const othersAvailable = screen.getAllByTestId('othersAvailable');
  expect(othersAvailable).toHaveLength(1);
});

it('should show no one available cell when neither user or others are available', () => {
  const time1 = new Date('05/04/2022');
  time1.setHours(9, 0, 0, 0);

  type Availability = {
    start: Date;
    end: Date;
    available: boolean;
  };

  const userNotFreeTime: Availability = {
    start: time1,
    end: time1,
    available: false,
  };
  const othersFreeTIme: Availability = {
    start: time1,
    end: time1,
    available: false,
  };

  const userAvailabilities = [userNotFreeTime];
  const othersAvailabilities = [othersFreeTIme];

  render(
    <Timematcher
      datesPicked={[new Date('05/04/2022')]}
      timeRange={[time1, time1]}
      userAvailability={userAvailabilities}
      othersAvailability={othersAvailabilities}
      userInFlock
    />,
  );

  const nooneAvailable = screen.getAllByTestId('nooneAvailable');
  expect(nooneAvailable).toHaveLength(1);
});
