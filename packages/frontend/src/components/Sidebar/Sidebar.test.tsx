import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

it('should render', () => {
  const { container } = render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>,
  );
  expect(container).toBeVisible();
});

it("should render the user's name if it is supplied", () => {
  render(
    <MemoryRouter>
      <Sidebar username="Goose" />
    </MemoryRouter>,
  );
  const name = screen.queryByText('Goose');
  expect(name).toBeVisible();
});

it('should handle when username is not supplied', () => {
  render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>,
  );
  const heading = screen.queryByText('Hello!');
  expect(heading).toBeVisible();
});

it('should render children', () => {
  render(
    <MemoryRouter>
      <Sidebar>
        <div role="children">
          <p>Paragaph</p>
          <p>Another paragraph</p>
        </div>
      </Sidebar>
    </MemoryRouter>,
  );

  const child = screen.queryByRole('children');
  expect(child).toBeVisible();
  expect(child?.textContent).toEqual('ParagaphAnother paragraph');
});
