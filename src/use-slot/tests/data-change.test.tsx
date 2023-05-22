import React, { useReducer } from 'react';

import { act } from 'react-dom/test-utils';
import { useSlot } from '..';
import { render } from '@testing-library/react';

const Child = () => {
  const [count, click] = useReducer((i: number) => i + 1, 0);
  useSlot(
    'a',
    () => {
      return <span>Hello {count}</span>;
    },
    [count],
  );
  return (
    <span onClick={click} id="world">
      World
    </span>
  );
};

const Container = () => {
  const slotA = useSlot('a');
  return (
    <div>
      {slotA} <Child />
    </div>
  );
};

it('data change', () => {
  const rr = render(<Container />);
  const { container } = rr;

  expect(container.textContent).toBe('Hello 0 World');

  act(() => {
    (container.querySelector('#world') as HTMLElement).click();
  });

  expect(container.textContent).toBe('Hello 1 World');
  act(() => {
    (container.querySelector('#world') as HTMLElement).click();
  });
  expect(container.textContent).toBe('Hello 2 World');
});
