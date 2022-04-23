import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Datepicker from './Datepicker';

it('should render', () => {
  const { container } = render(<Datepicker />);
  expect(container).toBeVisible();
});

it('should prompt user to select a day when none has been selected', () => {
  render(<Datepicker />);
  const pleaseSelectMessage = screen.getAllByText(/Please pick/i);
  expect(pleaseSelectMessage).toHaveLength(1);
});

it('should be able to select a day', () => {
  render(<Datepicker />);
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[2]);
  const selectedMessage = screen.getAllByText(/You selected/i);
  expect(selectedMessage).toHaveLength(1);
});

it('should be able to select multiple days', () => {
  render(<Datepicker />);
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[2]);
  fireEvent.click(buttons[3]);
  const selectedMessage = screen.getAllByText(/2 day/i);
  expect(selectedMessage).toHaveLength(1);
});
