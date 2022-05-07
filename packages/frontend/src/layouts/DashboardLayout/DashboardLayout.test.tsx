import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import DashboardLayout from './DashboardLayout';

test('should render', () => {
  const { container } = render(<DashboardLayout />);
  expect(container.firstChild).toBeVisible();
});
