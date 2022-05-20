import '@testing-library/jest-dom';
import { render, screen, act, fireEvent, within } from '@testing-library/react';
import CreateMeetingView from './CreateMeetingView';
import { MockedProvider } from '@apollo/client/testing';
import { CREATE_FLOCK, GET_CURRENT_USER_NAME, JOIN_FLOCK } from '../../apollo';
import MockDate from 'mockdate';

const successMocks = [
  {
    request: { query: GET_CURRENT_USER_NAME },
    result: { data: { getCurrentUser: { id: '1', name: 'User', flocks: [{ flockCode: 'ABC' }] } } },
  },
  {
    request: {
      query: CREATE_FLOCK,
      variables: {
        addFlockInput: {
          name: "User's Meeting",
          flockDays: [{ start: new Date(2022, 0, 10, 9, 0, 0, 0), end: new Date(2022, 0, 10, 17, 0, 0, 0) }],
        },
      },
    },
    result: { data: { addFlock: { flockCode: 'ABC123' } } },
  },
  {
    request: {
      query: CREATE_FLOCK,
      variables: {
        addFlockInput: {
          name: 'New Meeting',
          flockDays: [{ start: new Date(2022, 0, 10, 9, 0, 0, 0), end: new Date(2022, 0, 10, 17, 0, 0, 0) }],
        },
      },
    },
    result: { data: { addFlock: { flockCode: 'ABC123' } } },
  },
  {
    request: { query: JOIN_FLOCK, variables: { flockCode: 'ABC123' } },
    result: { data: { joinFlock: { flockCode: 'ABC123' } } },
  },
];

const errorMocks = [
  { request: { query: GET_CURRENT_USER_NAME }, error: new Error('Error!') },
  {
    request: {
      query: CREATE_FLOCK,
      variables: {
        addFlockInput: {
          name: 'New Meeting',
          flockDays: [{ start: new Date(2022, 0, 10, 9, 0, 0, 0), end: new Date(2022, 0, 10, 17, 0, 0, 0) }],
        },
      },
    },
    error: new Error('Error!'),
  },
  { request: { query: JOIN_FLOCK }, error: new Error('Error!') },
];

beforeAll(() => {
  MockDate.set(new Date(2022, 0, 3));
});

afterAll(() => {
  MockDate.reset();
});

it('should render', async () => {
  render(
    <MockedProvider>
      <CreateMeetingView />
    </MockedProvider>,
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0))); // To get past loading: https://www.apollographql.com/docs/react/development-testing/testing/#testing-the-success-state

  const nameMeetingLabel = screen.queryByLabelText('Name your meeting');
  const nameMeetingInput = screen.queryByDisplayValue('New Meeting');
  const dateLabel = screen.queryByText('Choose your dates');
  const timeLabel = screen.queryByText('Choose your times');
  const startTimePicker = screen.queryByText('No earlier than');
  const endTimePicker = screen.queryByText('No later than');
  const datePicker = screen.queryByText('Please pick one or more days.');

  expect(nameMeetingLabel).toBeVisible();
  expect(nameMeetingInput).toBeVisible();
  expect(dateLabel).toBeVisible();
  expect(timeLabel).toBeVisible();
  expect(startTimePicker).toBeVisible();
  expect(endTimePicker).toBeVisible();
  expect(datePicker).toBeVisible();
});

it('should fill in default meeting name', async () => {
  render(
    <MockedProvider mocks={successMocks} addTypename={false}>
      <CreateMeetingView />
    </MockedProvider>,
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const nameMeetingInput = screen.queryByDisplayValue("User's Meeting");
  expect(nameMeetingInput).toBeVisible();
});

it('should fill in default meeting name if username not supplied', async () => {
  render(
    <MockedProvider mocks={errorMocks} addTypename={false}>
      <CreateMeetingView />
    </MockedProvider>,
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const nameMeetingInput = screen.queryByDisplayValue('New Meeting');
  expect(nameMeetingInput).toBeVisible();
});

it('should show error message when inputs are invalid', async () => {
  render(
    <MockedProvider mocks={successMocks} addTypename={false}>
      <CreateMeetingView />
    </MockedProvider>,
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const button = screen.getByRole('button', { name: 'Create' });

  // If meeting name is empty, show error message
  const nameMeetingInput = screen.getByDisplayValue("User's Meeting");
  fireEvent.change(nameMeetingInput, { target: { value: '' } });
  fireEvent.click(button);
  const errorMessageMeetingName = screen.getByText('Please enter a meeting name');
  expect(errorMessageMeetingName).toBeVisible();
  fireEvent.change(nameMeetingInput, { target: { value: "User's Meeting" } });

  // If no date is selected, show error message
  fireEvent.click(button);
  const errorMessage = screen.getByText('Please select at least one date');
  expect(errorMessage).toBeVisible();

  // Select a date
  const dateButtons = screen.getAllByRole('button');
  const dateButton = dateButtons.find((d) => d.textContent?.includes('10'));
  dateButton && fireEvent.click(dateButton);

  // Select times
  const menus = screen.getAllByRole('button');
  const startTimeButton = menus.find((m) => m.textContent?.includes('9:00 am'));
  startTimeButton && fireEvent.mouseDown(startTimeButton);

  const listbox = screen.getByRole('listbox');
  const fivePM = within(listbox).getByText('5:00 pm');
  fireEvent.click(fivePM);
  fireEvent.click(button);
  const errorMessageTime = screen.getByText('Please select a valid time range');
  expect(errorMessageTime).toBeVisible();
});

it('should create a flock', async () => {
  window.alert = () => {};
  render(
    <MockedProvider mocks={successMocks} addTypename={false}>
      <CreateMeetingView />
    </MockedProvider>,
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const createButton = screen.getByRole('button', { name: 'Create' });

  // Select a date
  const dateButtons = screen.getAllByRole('button');
  const dateButton = dateButtons.find((d) => d.textContent?.includes('10'));
  dateButton && fireEvent.click(dateButton);

  // Create meeting
  fireEvent.click(createButton);
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  const errorMessage = screen.queryByText("Sorry, we couldn't create your meeting");
  expect(errorMessage).toBeNull();
});

it('should show error message when creating a flock fails', async () => {
  render(
    <MockedProvider mocks={errorMocks} addTypename={false}>
      <CreateMeetingView />
    </MockedProvider>,
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const createButton = screen.getByRole('button', { name: 'Create' });

  // Select a date
  const dateButtons = screen.getAllByRole('button');
  const dateButton = dateButtons.find((d) => d.textContent?.includes('10'));
  dateButton && fireEvent.click(dateButton);
  fireEvent.click(createButton);
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  const errorMessage = screen.getByText("Sorry, we couldn't create your meeting");
  expect(errorMessage).toBeVisible();
});
