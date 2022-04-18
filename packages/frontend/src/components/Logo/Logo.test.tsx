import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';

test('exists', () => {
  const { container } = render(<Logo size="footer" />);
  expect(container).toBeInTheDocument();
});

test('applies correct color class names', () => {
  render(<Logo size="footer" colored />);
  render(<Logo size="footer" />);
  const logos = screen.getAllByText('Flocker');

  expect(logos[0]).toHaveClass('colored');
  expect(logos[1]).not.toHaveClass('colored');
});

test('applies correct sizing class names', () => {
  render(<Logo size="footer" />);
  render(<Logo size="display" />);
  const logos = screen.getAllByText('Flocker');

  expect(logos[0]).toHaveClass('footer');
  expect(logos[1]).toHaveClass('display');
});
