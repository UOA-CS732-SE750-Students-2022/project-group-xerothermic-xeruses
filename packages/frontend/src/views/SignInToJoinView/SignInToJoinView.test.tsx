import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SignInToJoinView from './SignInToJoinView';

it('should render', () => {
  render(<SignInToJoinView />);
  expect(screen.getByText('Please sign in to join the meeting')).toBeVisible();
  expect(screen.getByText('Sign in with Google')).toBeVisible();
  expect(screen.getByText('Continue with Email')).toBeVisible();
});
