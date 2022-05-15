import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { GET_GOOGLE_CALENDAR_AUTH_URL } from '../../apollo';

const successMocks = [
  {
    request: { query: GET_GOOGLE_CALENDAR_AUTH_URL },
    result: { data: { googleCalendarAuthUrl: 'https://accounts.google.com/o/oauth2/v2/auth?testing' } },
  },
];

it('should render', () => {
  const { container } = render(
    <MockedProvider mocks={successMocks}>
      <BrowserRouter>
        <DashboardLayout />
      </BrowserRouter>
    </MockedProvider>,
  );
  expect(container).toBeVisible();
});
