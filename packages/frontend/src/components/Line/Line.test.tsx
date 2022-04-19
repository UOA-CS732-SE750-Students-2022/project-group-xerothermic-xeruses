import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import Line from './Line';

it('should render', () => {
  const {container} = render(<Line orText={true} size={'main'}/>);
  expect(container).toBeVisible();
});

it('should render without text', () => {
  const {container} = render(<Line size={'main'}/>);
  expect(container).toBeVisible();
});