import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import DashboardLayout from './DashboardLayout';
import { BrowserRouter } from 'react-router-dom';

it('should render', () => {
  const { container } = render(
    <BrowserRouter>
      <DashboardLayout />
    </BrowserRouter>,
  );
  expect(container).toBeVisible();
});
