import React from 'react';
import { useSlot } from '..';
import { render } from '@testing-library/react';

const Child = () => {
  useSlot(
    'a',
    () => {
      return 'Hello';
    },
    [],
  );
  return <span>World</span>;
};

const Wrapper = ({ children }: React.PropsWithChildren<unknown>) => {
  const slotA = useSlot('a');
  return (
    <span>
      {slotA} {children}
    </span>
  );
};

const Container = () => {
  return (
    <div>
      <Wrapper>
        <Child />
      </Wrapper>
    </div>
  );
};

it('as children', () => {
  const { container } = render(<Container />);
  expect(container.textContent).toBe('Hello World');
});
