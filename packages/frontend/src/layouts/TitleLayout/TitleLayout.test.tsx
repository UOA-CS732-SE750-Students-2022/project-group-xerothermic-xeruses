import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TitleLayout from './TitleLayout';

test('should render', () => {
  render(<TitleLayout title="Title" content={<p>Content</p>} />);
  const title = screen.queryByText('Title');
  const content = screen.queryByText('Content');

  expect(title).toBeVisible();
  expect(content).toBeVisible();
});
