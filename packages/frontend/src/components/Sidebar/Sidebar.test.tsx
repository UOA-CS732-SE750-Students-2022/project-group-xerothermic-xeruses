import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GET_GOOGLE_CALENDAR_AUTH_URL } from '../../apollo';
import Sidebar from './Sidebar';

const successMocks = [
  {
    request: { query: GET_GOOGLE_CALENDAR_AUTH_URL },
    result: { data: { googleCalendarAuthUrl: 'https://accounts.google.com/o/oauth2/v2/auth?testing' } },
  },
];

it('should render', () => {
  const { container } = render(
    <MockedProvider mocks={successMocks}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(container).toBeVisible();
});

it("should render the user's name if it is supplied", () => {
  render(
    <MockedProvider mocks={successMocks}>
      <MemoryRouter>
        <Sidebar username="Goose" />
      </MemoryRouter>
    </MockedProvider>,
  );
  const name = screen.queryByText('Goose');
  expect(name).toBeVisible();
});

it('should handle when username is not supplied', () => {
  render(
    <MockedProvider mocks={successMocks}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </MockedProvider>,
  );
  const heading = screen.queryByText('Hello!');
  expect(heading).toBeVisible();
});

it('should render children', () => {
  render(
    <MockedProvider mocks={successMocks}>
      <MemoryRouter>
        <Sidebar>
          <div role="children">
            <p>Paragaph</p>
            <p>Another paragraph</p>
          </div>
        </Sidebar>
      </MemoryRouter>
    </MockedProvider>,
  );

  const child = screen.queryByRole('children');
  expect(child).toBeVisible();
  expect(child?.textContent).toEqual('ParagaphAnother paragraph');
});
