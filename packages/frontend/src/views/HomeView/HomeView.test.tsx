import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import HomeView from './HomeView';

test('should render', () => {
  const { container, getByText } = render(<HomeView />);
  expect(container).toBeVisible();
  expect(getByText('Flocker')).toBeVisible();
  expect(getByText('Sign in with Google')).toBeVisible();
});
