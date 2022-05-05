import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

it('should render', () => {
  const { container } = render(<Sidebar />);
  expect(container).toBeVisible();
});

it("should render the user's name if it is supplied", () => {
  render(<Sidebar username="Goose" />);
  const name = screen.getByText('Goose');
  expect(name).toBeVisible();
});

it('should handle when username is not supplied', () => {
  render(<Sidebar />);
  const heading = screen.getByText('Hello!');
  expect(heading).toBeVisible();
});

it('should render children', () => {
  render(
    <Sidebar>
      <div className="children">
        <p>Paragaph</p>
        <p>Another paragraph</p>
      </div>
    </Sidebar>,
  );

  const child = document.querySelector('.content')?.children[1];
  expect(child).toBeVisible();
  expect(child?.className).toEqual('children');
});
