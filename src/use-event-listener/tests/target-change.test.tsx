import React, { useReducer, useState } from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useEventListener } from '..';

const targets = [new EventTarget(), new EventTarget()];

const Container = () => {
  const [count, add] = useReducer((i) => i + 1, 0);
  const [value, update] = useState('');
  useEventListener(
    'a',
    (e) => {
      if (e instanceof CustomEvent) update(e.detail);
    },
    { target: targets[count] },
  );
  return <var onClick={add}>{value}</var>;
};

describe('target change', () => {
  it('renders correct', () => {
    const { container } = render(<Container />);
    const el = container.firstChild;
    expect(el).toBeTruthy();
    if (!el) throw new Error('never');

    fireEvent(window, new CustomEvent('a', { detail: 'Dispatch to window' }));
    // Noting to change, handler bind on target[0], is not window
    expect(el.textContent).toBe('');

    act(() => {
      targets[0].dispatchEvent(new CustomEvent('a', { detail: 'Dispatch to targets[0]' }));
    });
    expect(el.textContent).toBe('Dispatch to targets[0]');

    // Next target
    fireEvent.click(el);
    act(() => {
      targets[0].dispatchEvent(new CustomEvent('a', { detail: 'Dispatch to targets[0] once more' }));
    });
    // Noting to change, handler of target[0] has removed, and add to target[1]
    expect(el.textContent).toBe('Dispatch to targets[0]');

    act(() => {
      targets[1].dispatchEvent(new CustomEvent('a', { detail: 'Dispatch to targets[1]' }));
    });
    expect(el.textContent).toBe('Dispatch to targets[1]');
  });
});
