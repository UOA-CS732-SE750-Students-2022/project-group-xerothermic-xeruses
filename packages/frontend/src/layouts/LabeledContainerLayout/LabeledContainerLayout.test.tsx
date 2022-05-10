import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LabeledContainerLayout from './LabeledContainerLayout';

it('should render', () => {
  render(<LabeledContainerLayout label="Label" content={<p>Content</p>} />);
  const label = screen.queryByText('Label');
  const content = screen.queryByText('Content');

  expect(label).toBeVisible();
  expect(content).toBeVisible();
});
