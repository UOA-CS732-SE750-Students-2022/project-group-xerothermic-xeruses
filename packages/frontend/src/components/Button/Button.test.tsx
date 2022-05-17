import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Button from './Button';

it('should render', () => {
  const { container } = render(<Button />);
  expect(container).toBeVisible();
});

it('should apply correct color class names', () => {
  render(<Button color="primary">Text</Button>);
  render(<Button color="white">Text</Button>);
  render(<Button color="black">Text</Button>);
  const buttons = screen.getAllByText('Text');

  expect(buttons[0]).toHaveClass('primary');
  expect(buttons[1]).toHaveClass('white');
  expect(buttons[2]).toHaveClass('black');
});

it('should apply correct variant class names', () => {
  render(<Button variant="filled">Text</Button>);
  render(<Button variant="outlined">Text</Button>);
  const buttons = screen.getAllByText('Text');

  expect(buttons[0]).toHaveClass('filled');
  expect(buttons[1]).toHaveClass('outlined');
});

it('should call onClick prop when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Text</Button>);
  const button = screen.getByText('Text');
  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
