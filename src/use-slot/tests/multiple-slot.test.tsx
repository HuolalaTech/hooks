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
  useSlot(
    'b',
    () => {
      return '->';
    },
    [],
  );
  return <span>World</span>;
};

const Container = () => {
  const slotA = useSlot('a');
  const slotB = useSlot('b');
  return (
    <div>
      {slotA} {slotB} <Child />
    </div>
  );
};

it('multiple slot', () => {
  const { container } = render(<Container />);
  expect(container.textContent).toBe('Hello -> World');
});
