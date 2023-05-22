import React from 'react';
import { useSlot } from '..';
import { render } from '@testing-library/react';

const ChildA = () => {
  const slotA = useSlot('a');
  return <span>{slotA}</span>;
};

const ChildB = () => {
  useSlot(
    'a',
    () => {
      return 'Hello';
    },
    [],
  );
  return <span>World</span>;
};

const Container = () => {
  return (
    <div>
      <ChildA /> <ChildB />
    </div>
  );
};

describe('as siblings', () => {
  it('renders correct', () => {
    const { container } = render(<Container />);
    expect(container.textContent).toBe('Hello World');
  });
});
