import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SidebarLayout from './SidebarLayout';

test('should render', () => {
  render(<SidebarLayout sidebarContent={<p>Sidebar content</p>} bodyContent={<p>Body content</p>} />);
  const sidebar = screen.queryByText('Sidebar content');
  const body = screen.queryByText('Body content');

  expect(sidebar).toBeVisible();
  expect(body).toBeVisible();
});
