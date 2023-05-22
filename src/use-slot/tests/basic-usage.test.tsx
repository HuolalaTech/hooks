import React from 'react';
import { useSlot, useSlotWriter } from '..';
import { render } from '@testing-library/react';

const Child = () => {
  useSlotWriter(
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

it('basic usage', () => {
  const { container } = render(<Container />);
  expect(container.textContent).toBe('Hello World');
});
