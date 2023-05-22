import React from 'react';
import { useSlot } from '..';
import { render } from '@testing-library/react';

const Container = () => {
  const slotA = useSlot('a');
  useSlot(
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
