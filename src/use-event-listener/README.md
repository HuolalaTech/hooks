# use-event-listener

## Definition

```typescript
interface Options extends Omit<AddEventListenerOptions, 'once'> {
  target?: EventTarget;
}

/**
 * Bind event listener on whole component lifecycle
 * @param options.target The event target, defaults window object
 * @param options.capture @see AddEventListenerOptions['capture']
 * @param options.passive @see AddEventListenerOptions['passive']
 */
export declare function useEventListener<E extends Event = Event>(
  eventName: string,
  listener: (e: E) => void,
  options?: Options,
): void;
```

## Demo

```jsx
import { useEventListener } from '@huolala-tech/hooks';
import { useState } from 'react';

export const DemoComponent = () => {
  const [content, update] = useState('');

  useEventListener('mousemove', (e: MouseEvent) => {
    update([e.clientX, e.clientY].join(','));
  });

  return (
    <div>
      <h3>{content}</h3>
    </div>
  );
};
```
