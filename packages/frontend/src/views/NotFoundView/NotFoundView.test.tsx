import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import NotFoundView from './NotFoundView';

test('first test', () => {
  render(<NotFoundView goBackLink="" />);
});
