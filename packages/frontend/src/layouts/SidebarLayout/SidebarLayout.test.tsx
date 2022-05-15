import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SidebarLayout from './SidebarLayout';

test('should render', () => {
  render(
    <MockedProvider>
      <MemoryRouter>
        <SidebarLayout sidebarContent={<p>Sidebar content</p>} bodyContent={<p>Body content</p>} />
      </MemoryRouter>
    </MockedProvider>,
  );
  const sidebar = screen.queryByText('Sidebar content');
  const body = screen.queryByText('Body content');

  expect(sidebar).toBeVisible();
  expect(body).toBeVisible();
});
