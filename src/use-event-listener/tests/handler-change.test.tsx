import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useEventListener } from '..';

const Component = ({ handler }: { handler: (e: Event) => void }) => {
  useEventListener('a', handler);
  return null;
};

it('handler change', () => {
  let inc = 0;

  const rr = render(
    <Component
      handler={() => {
        inc++;
      }}
    />,
  );

  // Nothing todo, inc must not be changed.
  expect(inc).toBe(0);

  // Fire a event, inc++ must be executed.
  fireEvent(window, new CustomEvent('a'));
  expect(inc).toBe(1);

  // Fire a event, inc++ must be executed.
  fireEvent(window, new CustomEvent('a'));
  expect(inc).toBe(2);

  rr.rerender(
    <Component
      handler={() => {
        inc *= 2;
      }}
    />,
  );

  // Nothing todo, inc must not be changed.
  expect(inc).toBe(2);

  // Fire a event, inc *= 2 must be executed.
  fireEvent(window, new CustomEvent('a'));
  expect(inc).toBe(4);

  // Fire a event, inc *= 2 must be executed.
  fireEvent(window, new CustomEvent('a'));
  expect(inc).toBe(8);

  // Bad case
  rr.rerender(<Component handler={undefined as unknown as () => void} />);

  // Nothing todo, inc must not be changed.
  fireEvent(window, new CustomEvent('a'));
  expect(inc).toBe(8);
});
