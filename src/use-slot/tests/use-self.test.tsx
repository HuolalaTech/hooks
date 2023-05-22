import React from 'react';
import { useSlot, useSlotWriter } from '..';
import { render } from '@testing-library/react';

const Container = () => {
  const slotA = useSlot('a');
  useSlotWriter(
    'a',
    () => {
      return 'Hello';
    },
    [],
  );
  return <div>{slotA} World</div>;
};

it('use self', () => {
  const { container } = render(<Container />);
  expect(container.textContent).toBe('Hello World');
});
