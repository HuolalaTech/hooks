import React, { useReducer } from 'react';

import { act } from 'react-dom/test-utils';
import { useSlot } from '..';
import { render } from '@testing-library/react';

const Level3 = () => {
  const [hasClicked, click] = useReducer(() => true, false);
  useSlot(
    'a',
    () => {
      return 'Z';
    },
    [],
  );
  if (hasClicked) return null;
  return (
    <span id="l3" onClick={click}>
      Level3
    </span>
  );
};

const Level2 = () => {
  const [hasClicked, click] = useReducer(() => true, false);
  useSlot(
    'a',
    () => {
      return 'Y';
    },
    [],
  );
  if (hasClicked) return null;
  return (
    <span>
      <span id="l2" onClick={click}>
        Level2
      </span>{' '}
      <Level3 />
    </span>
  );
};

const Level1 = () => {
  const [hasClicked, click] = useReducer(() => true, false);
  useSlot(
    'a',
    () => {
      return 'X';
    },
    [],
  );
  if (hasClicked) return null;
  return (
    <span>
      <span id="l1" onClick={click}>
        Level1
      </span>{' '}
      <Level2 />
    </span>
  );
};

const Container = () => {
  const slotA = useSlot('a');
  return (
    <div>
      {slotA} <Level1 />
    </div>
  );
};

it('tree order', () => {
  const { container } = render(<Container />);
  expect(container.textContent).toBe('Z Level1 Level2 Level3');
  act(() => {
    (container.querySelector('#l3') as HTMLElement).click();
  });
  expect(container.textContent?.trim()).toBe('Z Level1 Level2');
  act(() => {
    (container.querySelector('#l2') as HTMLElement).click();
  });
  expect(container.textContent?.trim()).toBe('Y Level1');
  act(() => {
    (container.querySelector('#l1') as HTMLElement).click();
  });
  expect(container.textContent?.trim()).toBe('X');
});
