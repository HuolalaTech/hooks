import React, { useReducer, useState } from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useEventListener } from '..';

const Container = () => {
  const [count, add] = useReducer((i) => i + 1, 1);
  const [value, update] = useState('');
  useEventListener(`a${count}`, (e) => {
    if (e instanceof CustomEvent) update(e.detail);
  });
  return <var onClick={add}>{value}</var>;
};

describe('target change', () => {
  it('renders correct', () => {
    const { container } = render(<Container />);
    const el = container.firstChild;
    expect(el).toBeTruthy();
    if (!el) throw new Error('never');

    expect(el.textContent).toBe('');

    fireEvent(window, new CustomEvent('a', { detail: 'a' }));
    // Noting to change, eventName is a1, not a
    expect(el.textContent).toBe('');

    fireEvent(window, new CustomEvent('a1', { detail: 'a1' }));
    expect(el.textContent).toBe('a1');

    fireEvent.click(el);
    fireEvent(window, new CustomEvent('a1', { detail: 'a1 once more' }));
    // Noting to change, eventHanme has changed
    expect(el.textContent).toBe('a1');

    fireEvent(window, new CustomEvent('a2', { detail: 'a2' }));
    expect(el.textContent).toBe('a2');
  });
});
