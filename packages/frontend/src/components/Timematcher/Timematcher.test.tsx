import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Timematcher from './Timematcher';

it('should render', () => {
  const time1 = new Date('05/04/2022');
  time1.setHours(9, 0, 0, 0);

  const time2 = new Date('05/04/2022');
  time2.setHours(9, 15, 0, 0);

  const time3 = new Date('05/04/2022');
  time3.setHours(9, 30, 0, 0);

  const time4 = new Date('05/06/2022');
  time4.setHours(9, 0, 0, 0);

  const time5 = new Date('05/06/2022');
  time5.setHours(9, 15, 0, 0);

  const time6 = new Date('05/06/2022');
  time6.setHours(9, 30, 0, 0);

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
  const freeTime3: Availability = {
    start: time3,
    end: time4,
    available: true,
  };

  const freeTime4: Availability = {
    start: time4,
    end: time5,
    available: true,
  };

  const freeTime5: Availability = {
    start: time5,
    end: time6,
    available: true,
  };

  const freeTimes = [freeTime1, freeTime2, freeTime3, freeTime4, freeTime5];

  const { container } = render(
    <Timematcher
      rowTitle=""
      dates={[new Date('05/04/2022'), new Date('05/06/2022')]}
      timeRange={[time1, time2]}
      userAvailability={freeTimes}
      othersAvailability={freeTimes}
    />,
  );
  expect(container).toBeVisible();
});
