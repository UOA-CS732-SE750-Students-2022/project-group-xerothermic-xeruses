import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Line from './Line';

it('should render', () => {
  const { container } = render(<Line text="hi" />);
  expect(container).toBeVisible();
});

it('should render without text', () => {
  const { container } = render(<Line />);
  expect(container).toBeVisible();
});

it('should render with the text supplied', () => {
  render(<Line text="hi" />);
  const line = screen.getByText('hi');
  expect(line).toBeVisible();
});
