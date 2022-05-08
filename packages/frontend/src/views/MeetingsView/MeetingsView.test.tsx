import '@testing-library/jest-dom';
import MeetingsView from './MeetingsView';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_USER_FLOCKS } from '../../apollo';
import { BrowserRouter } from 'react-router-dom';

const flockResultMock = {
  request: {
    query: GET_USER_FLOCKS,
  },
  result: {
    data: {
      getCurrentUser: {
        flocks: [
          {
            name: 'Meeting 1',
            flockDays: [{ start: new Date('2022-05-07T00:00:00.000Z'), end: new Date('2022-05-12T00:00:00.000Z') }],
            users: [{ id: '1' }, { id: '2' }],
            flockCode: '1',
          },
          {
            name: 'Meeting 2',
            flockDays: [{ start: new Date('2022-05-11T00:00:00.000Z'), end: new Date('2022-05-19T00:00:00.000Z') }],
            users: [{ id: '1' }, { id: '2' }, { id: '3' }],
            flockCode: '2',
          },
        ],
      },
    },
  },
};

const emptyFlockResultMock = {
  request: {
    query: GET_USER_FLOCKS,
  },
  result: {
    data: {
      getCurrentUser: {
        flocks: [],
      },
    },
  },
};

const errorMock = {
  request: {
    query: GET_USER_FLOCKS,
  },
  error: new Error('An error occurred'),
};

const getComponent = () => (
  <BrowserRouter>
    <MeetingsView />
  </BrowserRouter>
);

it('should render', async () => {
  const { container } = render(<MockedProvider>{getComponent()}</MockedProvider>);
  expect(container).toBeVisible();
});

it('should show error message when no data is returned', async () => {
  render(<MockedProvider>{getComponent()}</MockedProvider>);
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const text = screen.queryByText("Sorry, we couldn't get your meetings :(");
  expect(text).toBeVisible();
});

it('should show meeting cards', async () => {
  render(<MockedProvider mocks={[flockResultMock]}>{getComponent()}</MockedProvider>);
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  const title1 = screen.queryByText('Meeting 1');
  const participants1 = screen.queryByText('2 participants');
  const dates1 = screen.queryByText('May 7, 2022 - May 12, 2022');
  expect(title1).toBeVisible();
  expect(participants1).toBeVisible();
  expect(dates1).toBeVisible();

  const title2 = screen.queryByText('Meeting 2');
  const participants2 = screen.queryByText('3 participants');
  const dates2 = screen.queryByText('May 11, 2022 - May 19, 2022');
  expect(title2).toBeVisible();
  expect(participants2).toBeVisible();
  expect(dates2).toBeVisible();
});

it('should show message when user had no flocks', async () => {
  render(<MockedProvider mocks={[emptyFlockResultMock]}>{getComponent()}</MockedProvider>);
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const text = screen.queryByText('You are not part of any meetings');
  expect(text).toBeVisible();
});

it('should show error message when error occurs', async () => {
  render(<MockedProvider mocks={[errorMock]}>{getComponent()}</MockedProvider>);
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const text = screen.queryByText("Sorry, we couldn't get your meetings :(");
  expect(text).toBeVisible();
});
