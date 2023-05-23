# use-slot

## Definition

```typescript
import type { DependencyList, ReactNode } from 'react';

/**
 * Read the slot content. You can set content using `useSlotWritter(name, factory, deps)`.
 * @param name slot identifier
 */
export declare function useSlot(name: PropertyKey): ReactNode;

/**
 * Set the slot content and notify all references update in realtime.
 * When the current component unmounted, all content may rollback to previous state.
 * @param name slot identifier
 * @param factory content factory
 * @param deps dependencies
 */
export declare function useSlotWriter(name: PropertyKey, factory: () => ReactNode, deps: DependencyList): void;
```

## Demo

```jsx
import { useSlot, useSlotWriter } from '@huolala-tech/hooks';
import { useReducer } from 'react';

const SubContent = () => {
  const [count, add] = useReducer((i) => i + 1, 1);

  // Put this jsx fragment into 'headerSpace' slot.
  useSlotWriter(
    'headerSpace',
    () => {
      return <span>{count}</span>;
    },
    [count],
  );

  return <button onClick={add}>+1</button>;
};

const MyPage = () => {
  // Declare a slot named 'headerSpace'
  const headerSpace = useSlot('headerSpace');
  return (
    <div>
      <header>{headerSpace}</header>
      <div>
        <aside>blah blah</aside>
        <SubContent />
      </div>
    </div>
  );
};
```
