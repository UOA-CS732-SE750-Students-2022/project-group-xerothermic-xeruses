import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarList from './CalendarList';

type Calendar = {
  name: string;
  id: string;
  enabled: boolean;
};

const calendar1: Calendar = {
  name: 'cal1',
  id: '1',
  enabled: false,
};

const calendar2: Calendar = {
  name: 'cal2',
  id: '2',
  enabled: false,
};

it('should render', () => {
  const { container } = render(<CalendarList calendars={[]} initialSelectedCalendars={[]} onUpdate={() => {}} />);
  expect(container).toBeVisible();
});

it('should be able show list of calendars names and checkboxes', () => {
  render(<CalendarList calendars={[calendar1, calendar2]} initialSelectedCalendars={[]} onUpdate={() => {}} />);
  const calendar1Name = screen.getByText(/cal1/i);
  const calendar2Name = screen.getByText(/cal2/i);
  const checkboxes = screen.getAllByRole('checkbox');
  expect(calendar1Name).toBeVisible();
  expect(calendar2Name).toBeVisible();
  expect(checkboxes).toHaveLength(2);
});

it('should be able to select calendars', () => {
  const getSelectedCalendars = jest.fn();
  render(<CalendarList calendars={[calendar1]} initialSelectedCalendars={[]} onUpdate={getSelectedCalendars} />);
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  expect(getSelectedCalendars).toHaveBeenCalledTimes(1);
  expect(checkbox).toHaveProperty('checked', true);
});

it('should be able to unselect calendars', () => {
  const getSelectedCalendars = jest.fn();
  render(
    <CalendarList calendars={[calendar1]} initialSelectedCalendars={[calendar1]} onUpdate={getSelectedCalendars} />,
  );
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  expect(getSelectedCalendars).toHaveBeenCalledTimes(1);
  expect(checkbox).toHaveProperty('checked', false);
});
