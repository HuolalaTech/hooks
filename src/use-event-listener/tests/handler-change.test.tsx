import React, { useState, useReducer } from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useEventListener } from '..';

const Container = () => {
  const [count, add] = useReducer((i) => i + 1, 1);
  const [value, update] = useState(count);
  useEventListener('a', () => {
    update(count);
  });
  return <var onClick={add}>{value}</var>;
};

describe('handler change', () => {
  it('renders correct', () => {
    const {
      container: { firstChild },
    } = render(<Container />);
    expect(firstChild).toBeTruthy();

    fireEvent(window, new CustomEvent('a'));
    expect(firstChild?.textContent).toBe('1');

    if (firstChild) fireEvent.click(firstChild);
    expect(firstChild?.textContent).toBe('1');

    fireEvent(window, new CustomEvent('a'));
    expect(firstChild?.textContent).toBe('2');
  });
});
