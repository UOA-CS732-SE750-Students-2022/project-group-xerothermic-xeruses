import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SidebarLayout from './SidebarLayout';
import { MemoryRouter } from 'react-router-dom';

test('should render', () => {
  render(
    <MemoryRouter>
      <SidebarLayout sidebarContent={<p>Sidebar content</p>} bodyContent={<p>Body content</p>} />
    </MemoryRouter>,
  );
  const sidebar = screen.queryByText('Sidebar content');
  const body = screen.queryByText('Body content');

  expect(sidebar).toBeVisible();
  expect(body).toBeVisible();
});
