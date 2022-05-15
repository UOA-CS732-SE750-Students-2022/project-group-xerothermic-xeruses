import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

it('should render', () => {
  const { container } = render(
    <MockedProvider>
      <BrowserRouter>
        <DashboardLayout />
      </BrowserRouter>
    </MockedProvider>,
  );
  expect(container).toBeVisible();
});
