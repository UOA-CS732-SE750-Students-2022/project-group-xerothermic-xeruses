import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import StyledDivider from './StyledDivider';

it('should render', () => {
  const {container} = render(<StyledDivider orText={true} size={'main'}/>);
  expect(container).toBeVisible();
});

it('should render without text', () => {
  const {container} = render(<StyledDivider size={'main'}/>);
  expect(container).toBeVisible();
});