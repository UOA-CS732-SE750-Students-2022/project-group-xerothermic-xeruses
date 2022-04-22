import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HomeView from './HomeView';

test('should render', () => {
  const { container } = render(<HomeView />);
  expect(container).toBeVisible();
  expect(screen.getByText('Flocker')).toBeVisible();
  expect(screen.getByText('Sign in with Google')).toBeVisible();
});
