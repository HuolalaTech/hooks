import React from 'react';
import { useSlot } from '..';
import { render } from '@testing-library/react';

const Child = () => {
  useSlot(
    'a',
    () => {
      return 'Hello';
    },
    [],
  );
  return <span>World</span>;
};

const Container = () => {
  const slotA = useSlot('a');
  return (
    <div>
      {slotA} <Child />
    </div>
  );
};

describe('basic usage', () => {
  it('renders correct', () => {
    const { container } = render(<Container />);
    expect(container.textContent).toBe('Hello World');
  });
});
