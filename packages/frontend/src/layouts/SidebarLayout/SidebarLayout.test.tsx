import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SidebarLayout from './SidebarLayout';

test('should render', () => {
  render(<SidebarLayout title="Title" sidebarContent={<p>Sidebar content</p>} bodyContent={<p>Body content</p>} />);
  const title = screen.queryByText('Title');
  const sidebar = screen.queryByText('Sidebar content');
  const body = screen.queryByText('Body content');

  expect(title).toBeVisible();
  expect(sidebar).toBeVisible();
  expect(body).toBeVisible();
});
