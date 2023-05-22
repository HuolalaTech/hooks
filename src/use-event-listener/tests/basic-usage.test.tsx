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
