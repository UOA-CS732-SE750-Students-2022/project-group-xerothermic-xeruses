import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

it('should render', () => {
  const { container } = render(
    <MockedProvider>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(container).toBeVisible();
});

it("should render the user's name if it is supplied", () => {
  render(
    <MockedProvider>
      <MemoryRouter>
        <Sidebar username="Goose" />
      </MemoryRouter>
    </MockedProvider>,
  );
  const name = screen.queryByText('Goose');
  expect(name).toBeVisible();
});

it('should handle when username is not supplied', () => {
  render(
    <MockedProvider>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </MockedProvider>,
  );
  const heading = screen.queryByText('Hello!');
  expect(heading).toBeVisible();
});

it('should render children', () => {
  render(
    <MockedProvider>
      <MemoryRouter>
        <Sidebar>
          <div role="children">
            <p>Paragaph</p>
            <p>Another paragraph</p>
          </div>
        </Sidebar>
      </MemoryRouter>
    </MockedProvider>,
  );

  const child = screen.queryByRole('children');
  expect(child).toBeVisible();
  expect(child?.textContent).toEqual('ParagaphAnother paragraph');
});

it('should render button to add calendars from Google', () => {
  render(
    <MockedProvider>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </MockedProvider>,
  );

  const elem = screen.queryByText('Add calendars from Google');
  expect(elem).toBeVisible();
  expect(elem).toBeInstanceOf(HTMLAnchorElement);
});
