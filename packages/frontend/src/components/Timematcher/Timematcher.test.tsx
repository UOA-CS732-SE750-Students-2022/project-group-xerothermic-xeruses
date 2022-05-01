import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Timematcher from './Timematcher';

test('first test', () => {
  render(
    <Timematcher
      rowTitle=""
      dates={[new Date('04/30/2022'), new Date('05/04/2022')]}
      timeRange={[]}
      availabilityIds={[]}
    />,
  );
});
