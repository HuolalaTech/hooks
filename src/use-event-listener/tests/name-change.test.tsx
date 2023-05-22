import React, { useState } from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useEventListener } from '..';

const Component = ({ name }: { name: string }) => {
  const [value, update] = useState('');
  useEventListener(name, (e) => {
    if (e instanceof CustomEvent) update(e.detail);
  });
  return <var>{value}</var>;
};

it('name change', () => {
  const tt = render(<Component name="a" />);
  const { container } = tt;

  // By default, state is empty.
  expect(container.textContent).toBe('');

  // Noting to change, eventName is b, not a
  fireEvent(window, new CustomEvent('b', { detail: 'b' }));
  expect(container.textContent).toBe('');

  // Event name matched, state updated.
  fireEvent(window, new CustomEvent('a', { detail: 'a' }));
  expect(container.textContent).toBe('a');

  tt.rerender(<Component name="b" />);

  // Event name matched, state updated.
  fireEvent(window, new CustomEvent('b', { detail: 'b' }));
  expect(container.textContent).toBe('b');

  // Noting to change, eventName is b, not a
  fireEvent(window, new CustomEvent('a', { detail: 'a' }));
  expect(container.textContent).toBe('b');
});
