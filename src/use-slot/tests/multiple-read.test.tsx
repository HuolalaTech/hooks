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

const Wrapper = () => {
  const slotA = useSlot('a');
  return (
    <div>
      {slotA} {slotA} <Child />
    </div>
  );
};

const Container = () => {
  const slotA = useSlot('a');
  return (
    <div>
      {slotA} {slotA} <Wrapper />
    </div>
  );
};

it('multiple read', () => {
  const { container } = render(<Container />);
  expect(container.textContent).toBe('Hello Hello Hello Hello World');
});
