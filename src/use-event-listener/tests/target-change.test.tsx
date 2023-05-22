import React, { useState } from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useEventListener } from '..';

const Component = ({ target }: { target?: EventTarget }) => {
  const [value, update] = useState('');
  useEventListener(
    'a',
    (e) => {
      if (e instanceof CustomEvent) update(e.detail);
    },
    { target },
  );
  return <var>{value}</var>;
};

it('target change', () => {
  const rr = render(<Component />);
  const { container } = rr;

  // By default, target is window.
  fireEvent(window, new CustomEvent('a', { detail: 'window' }));
  expect(container.textContent).toBe('window');

  const et1 = document.createElement('div');
  rr.rerender(<Component target={et1} />);

  // Now, the target is et1, firing a event from window cannot update state.
  fireEvent(window, new CustomEvent('a', { detail: 'hehe' }));
  expect(container.textContent).toBe('window');

  // Fireing a event from et1 can update state.
  fireEvent(et1, new CustomEvent('a', { detail: 'et1' }));
  expect(container.textContent).toBe('et1');

  const et2 = document.createElement('div');
  rr.rerender(<Component target={et2} />);

  // Now, the target is et2, firing a event from window cannot update state.
  fireEvent(window, new CustomEvent('a', { detail: 'hehe' }));
  expect(container.textContent).toBe('et1');

  // And, firing a event from ert1 cannot update state.
  fireEvent(et1, new CustomEvent('a', { detail: 'hehe' }));
  expect(container.textContent).toBe('et1');

  // Fireing a event from et2 can update state.
  fireEvent(et2, new CustomEvent('a', { detail: 'et2' }));
  expect(container.textContent).toBe('et2');
});
