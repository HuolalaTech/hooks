import React from 'react';
import { useSlot } from '..';
import { render } from '@testing-library/react';

const Child = () => {
  const slotA = useSlot('a');
  if (slotA === undefined) throw new Error('slotA must never be undefined');
  return <span>{slotA}</span>;
};

const Container = () => {
  useSlot(
    'a',
    () => {
      return 'World';
    },
    [],
  );
  return (
    <div>
      Hello <Child />
    </div>
  );
};

it('write before read', () => {
  const { container } = render(<Container />);
  expect(container.textContent).toBe('Hello World');
});
