import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SidebarLayout from './SidebarLayout';
import { GET_GOOGLE_CALENDAR_AUTH_URL } from '../../apollo';

const successMocks = [
  {
    request: { query: GET_GOOGLE_CALENDAR_AUTH_URL },
    result: { data: { googleCalendarAuthUrl: 'https://accounts.google.com/o/oauth2/v2/auth?testing' } },
  },
];

test('should render', () => {
  render(
    <MockedProvider mocks={successMocks}>
      <MemoryRouter>
        <SidebarLayout sidebarContent={<p>Sidebar content</p>} bodyContent={<p>Body content</p>} />
      </MemoryRouter>
    </MockedProvider>,
  );
  const sidebar = screen.queryByText('Sidebar content');
  const body = screen.queryByText('Body content');

  expect(sidebar).toBeVisible();
  expect(body).toBeVisible();
});
