import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Datepicker from './Datepicker';

const mockDatesPicked = jest.fn();

it('should render', () => {
  const { container } = render(<Datepicker datesPicked={mockDatesPicked} />);
  expect(container).toBeVisible();
});

it('should prompt user to select a day when none has been selected', () => {
  render(<Datepicker datesPicked={mockDatesPicked} />);
  const pleaseSelectMessage = screen.getAllByText(/Please pick/i);
  expect(pleaseSelectMessage).toHaveLength(1);
});

it('should be able to select a day', () => {
  render(<Datepicker datesPicked={mockDatesPicked} />);
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[2]);
  const selectedMessage = screen.getAllByText(/You selected/i);
  expect(selectedMessage).toHaveLength(1);
});

it('should be able to select multiple days', () => {
  render(<Datepicker datesPicked={mockDatesPicked} />);
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[2]);
  fireEvent.click(buttons[3]);
  const selectedMessage = screen.getAllByText(/2 day/i);
  expect(selectedMessage).toHaveLength(1);
});

it('should call datesPicked callback function when date(s) selected', () => {
  render(<Datepicker datesPicked={mockDatesPicked} />);
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[2]);
  expect(mockDatesPicked).toBeCalledTimes(1);
});
