import React from 'react';
import { useSlot } from '..';
import { render } from '@testing-library/react';

const Container = () => {
  try {
    (useSlot as (a: string, b: () => void) => void)('a', () => 0);
    return null;
  } catch (error) {
    return <div>error</div>;
  }
};

it('basic usage', () => {
  const { container } = render(<Container />);
  expect(container.textContent).toBe('error');
});
