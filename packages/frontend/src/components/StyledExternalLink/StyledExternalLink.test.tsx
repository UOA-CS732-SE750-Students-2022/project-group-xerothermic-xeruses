import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import StyledExternalLink from './StyledExternalLink';

const windowOpen = global.window.open;

beforeEach(() => {
  global.window.open = windowOpen;
});

it('should render', () => {
  render(<StyledExternalLink href="https://example.com">Example</StyledExternalLink>);

  expect(screen.getByText('Example')).toBeVisible();
});

it('should have a link to the external site', () => {
  render(<StyledExternalLink href="https://example.com">Example</StyledExternalLink>);
  expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
});

it('should not have target="_blank" for opening in the current tab', () => {
  render(
    <StyledExternalLink href="https://example.com" openIn="current-tab">
      Example
    </StyledExternalLink>,
  );
  expect(screen.getByRole('link')).not.toHaveAttribute('target');
});

it('should have target="_blank" for opening in a new tab', () => {
  render(
    <StyledExternalLink href="https://example.com" openIn="new-tab">
      Example
    </StyledExternalLink>,
  );
  expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
});

it('should have a click listener for opening in a popup window', () => {
  render(
    <StyledExternalLink href="https://example.com" openIn="popup">
      Example
    </StyledExternalLink>,
  );

  global.window.open = jest.fn();
  fireEvent.click(screen.getByText('Example'));
  expect(global.window.open).toHaveBeenCalledTimes(1);
});
