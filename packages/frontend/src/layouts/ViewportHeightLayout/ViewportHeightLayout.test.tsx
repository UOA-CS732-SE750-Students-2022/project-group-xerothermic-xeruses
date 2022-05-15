import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ViewportHeightLayout from './ViewportHeightLayout';

it('should render', () => {
  render(
    <ViewportHeightLayout>
      <p>Paragraph</p>
    </ViewportHeightLayout>,
  );
  const paragraph = screen.getByText('Paragraph');
  expect(paragraph).toBeVisible();
});

it('should be the correct height', () => {
  global.window.innerHeight = 500;
  render(<ViewportHeightLayout>Paragraph</ViewportHeightLayout>);
  const layout = screen.getByText('Paragraph');
  expect(layout.style.height).toBe('500px');
});
