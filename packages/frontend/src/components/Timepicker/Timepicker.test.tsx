import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Timepicker from './Timepicker';

it('should render', () => {
  const { container } = render(<Timepicker label="timepicker" />);
  expect(container).toBeVisible();
});

it('should show label', () => {
  render(<Timepicker label="timepicker" />);
  const label = screen.getByText('timepicker');
  expect(label).toBeVisible();
});

it('should select the right time option when clicked', () => {
  render(<Timepicker label="timepicker" />);
  fireEvent.mouseDown(screen.getByRole('button'));

  const listbox = within(screen.getByRole('listbox'));

  fireEvent.click(listbox.getByText(/9 AM/i));

  expect(screen.getByRole('menu')).toHaveTextContent(/9 AM/i);
});
