import React, { useState } from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useEventListener } from '..';

const Container = () => {
  const [value, update] = useState('');
  useEventListener('a', (event) => {
    if (event instanceof CustomEvent) {
      update(String(event.detail));
    }
  });
  return <div>{value}</div>;
};

it('basic usage', () => {
  const { container } = render(<Container />);
  for (const text of ['Hello', 'Hello World']) {
    fireEvent(window, new CustomEvent('a', { detail: text }));
    expect(container.textContent).toBe(text);
  }
});

it('type infering', () => {
  const neverCall = jest.fn(() => {
    useEventListener('keydown', (e) => {
      // The e is a KeyboardEvent, because the target is a window by default.
      e.key;
    });

    useEventListener('click', (e) => {
      // The e is a MouseEvent, because the target is a window by default.
      e.clientX;
    });

    useEventListener(
      'click',
      (e) => {
        // Asserts the e is a pure Event and not a MouseEvent.
        const _: Event extends typeof e ? true : false = true;
        void _;
      },
      { target: new EventTarget() },
    );
  });
  expect(neverCall).toBeCalledTimes(0);
});
