import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Timepicker from './Timepicker';

it('should render', () => {
  const timeChanged = jest.fn();
  const { container } = render(<Timepicker label="timepicker" timeChanged={timeChanged} />);
  expect(container).toBeVisible();
});

it('should show label', () => {
  const timeChanged = jest.fn();
  render(<Timepicker label="timepicker" timeChanged={timeChanged} />);
  const label = screen.getByText('timepicker');
  expect(label).toBeVisible();
});

it('should select the right time option when clicked', () => {
  const timeChanged = jest.fn();
  render(<Timepicker label="timepicker" timeChanged={timeChanged} />);
  fireEvent.mouseDown(screen.getByRole('button'));
  const listbox = within(screen.getByRole('listbox'));
  fireEvent.click(listbox.getByText(/9:00 am/i));
  expect(screen.getByRole('menu')).toHaveTextContent(/9:00 am/i);
});

it('should call timeChanged when selected', () => {
  const timeChanged = jest.fn();
  render(<Timepicker label="timepicker" timeChanged={timeChanged} />);
  fireEvent.mouseDown(screen.getByRole('button'));
  const listbox = within(screen.getByRole('listbox'));
  fireEvent.click(listbox.getByText(/9:00 am/i));
  expect(timeChanged).toBeCalledTimes(1);
});
