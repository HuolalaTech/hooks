import React from 'react';
import { useSlot, useSlotWriter } from '..';
import { render } from '@testing-library/react';

const ChildA = () => {
  const slotA = useSlot('a');
  return <span>{slotA}</span>;
};

const ChildB = () => {
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
  return (
    <div>
      <ChildA /> <ChildB />
    </div>
  );
};

it('as siblings', () => {
  const { container } = render(<Container />);
  expect(container.textContent).toBe('Hello World');
});
