import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Timematcher from './Timematcher';

test('first test', () => {
  render(<Timematcher rowHeader="" dates={[]} timeRange={[]} />);
});
