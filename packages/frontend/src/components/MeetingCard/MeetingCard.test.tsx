import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import MeetingCard from './MeetingCard';

it('should render', () => {
  const dateRange: [Date, Date] = [new Date(2022, 2, 22), new Date(2022, 2, 26)];
  render(<MeetingCard title="Meeting" numParticipants={2} dateRange={dateRange} />);
  const title = screen.queryByText('Meeting');
  const participants = screen.queryByText('2 participants');
  const datesString = screen.queryByText('Mar 22, 2022 - Mar 26, 2022');

  expect(title).toBeVisible();
  expect(participants).toBeVisible();
  expect(datesString).toBeVisible();
});

it('should be grammatically correct for a singular participant', () => {
  const dateRange: [Date, Date] = [new Date(2022, 2, 22), new Date(2022, 2, 26)];
  render(<MeetingCard title="Meeting" numParticipants={1} dateRange={dateRange} />);
  const participants = screen.queryByText('1 participant');
  const participantsWrong = screen.queryByText('1 participants');
  expect(participants).toBeVisible();
  expect(participantsWrong).toBeNull();
});

it('should call onClick prop when clicked', () => {
  const fn = jest.fn();
  render(<MeetingCard title="Meeting" numParticipants={2} dateRange={[new Date(), new Date()]} onClick={fn} />);
  const card = screen.getByText('Meeting');
  fireEvent.click(card);
  expect(fn).toBeCalledTimes(1);
});
