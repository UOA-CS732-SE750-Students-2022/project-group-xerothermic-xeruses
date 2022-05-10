import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import StyledNavLink from './StyledNavLink';

it('should render', () => {
  render(
    <MemoryRouter>
      <StyledNavLink to="/route">Hello</StyledNavLink>
    </MemoryRouter>,
  );

  expect(screen.getByText('Hello')).toBeVisible();
});

it('should go to the correct route', () => {
  const history = createMemoryHistory();
  render(
    <HistoryRouter history={history}>
      <StyledNavLink to="/route">Hello</StyledNavLink>
    </HistoryRouter>,
  );
  fireEvent.click(screen.getByText('Hello'));
  expect(history.location.pathname).toEqual('/route');
});
