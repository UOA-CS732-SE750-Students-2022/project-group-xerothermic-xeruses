import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import HomeView from '../HomeView';
import NotFoundView from './NotFoundView';

const renderViewsWithMemory = (goBackLink: string) => {
  render(
    <MockedProvider>
      <MemoryRouter initialEntries={['/bad/route']}>
        <HomeView />
        <DashboardLayout />
        <NotFoundView goBackLink={goBackLink} />
      </MemoryRouter>
    </MockedProvider>,
  );
};

it('should render', () => {
  const { container } = render(
    <BrowserRouter>
      <NotFoundView goBackLink="/" />
    </BrowserRouter>,
  );

  expect(container).toBeVisible();
  expect(screen.getByText('404')).toBeVisible();
  expect(screen.getByText('Go Back')).toBeVisible();
  expect(screen.getByText('The goose stole the page you were looking for!')).toBeVisible();
});

it('should take the user back to the home page when they are unauthenticated', () => {
  renderViewsWithMemory('/');

  expect(screen.getByText('404')).toBeVisible();
  fireEvent.click(screen.getByText('Go Back'));

  // Ensure we go back to the home page
  expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  expect(screen.getByText('Continue with Email')).toBeInTheDocument();
});

it('should take the user back to the dashboard when they are authenticated', () => {
  renderViewsWithMemory('/dashboard');

  expect(screen.getByText('404')).toBeVisible();
  fireEvent.click(screen.getByText('Go Back'));

  // Ensure we go back to the dashboard
  expect(screen.getByText('My Meetings')).toBeInTheDocument();
});
