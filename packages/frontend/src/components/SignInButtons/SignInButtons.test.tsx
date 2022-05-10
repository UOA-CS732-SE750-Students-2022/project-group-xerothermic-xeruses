import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import SignInButtons from './SignInButtons';
import * as firebase from '../../auth/firebase';

it('should render', () => {
  render(<SignInButtons />);
  expect(screen.getByText('Sign in with Google')).toBeVisible();
  expect(screen.getByText('or')).toBeVisible();
  expect(screen.getByText('Continue as Guest')).toBeVisible();
});

it('should sign in with google', () => {
  const mock = jest.fn();
  jest.spyOn(firebase, 'signInWithGoogle').mockImplementation(mock);

  render(<SignInButtons />);
  const button = screen.getByText('Sign in with Google');
  fireEvent.click(button);
  expect(mock).toBeCalledTimes(1);
});
