import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import BeforeFirstLoadView from './BeforeFirstLoadView';

it('should render', () => {
  const { container } = render(<BeforeFirstLoadView />);
  expect(container).toBeVisible();
  expect(screen.getByText('Flocker')).toBeVisible();
});

it('should not be interactive', () => {
  const { container } = render(<BeforeFirstLoadView />);
  expect(container).toBeVisible();
  expect(screen.queryByRole('link')).toBeNull();
  expect(screen.queryByRole('radio')).toBeNull();
  expect(screen.queryByRole('slider')).toBeNull();
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.queryByRole('textbox')).toBeNull();
  expect(screen.queryByRole('combobox')).toBeNull();
  expect(screen.queryByRole('searchbox')).toBeNull();
  expect(screen.queryByRole('spinbutton')).toBeNull();
});
