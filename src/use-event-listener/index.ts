import { useCallback, useEffect, useMemo, useRef } from 'react';

interface Options<T extends EventTarget> extends Omit<AddEventListenerOptions, 'once'> {
  target?: T;
}

type Handler<E extends Event> = (e: E) => void;

/**
 * A native DOM event target usually has an associated `on${name}` property, from which we can infer the event type.
 */
type GuessEvent<T extends EventTarget, N extends string> = T extends Node | Window | XMLHttpRequest
  ? T extends { [p in `on${N}`]?: ((e: infer U) => void) | null }
    ? U extends Event
      ? U
      : Event
    : Event
  : Event;

/**
 * Bind event listener on whole component lifecycle
 * @param options.target The event target, defaults window object
 * @param options.capture @see AddEventListenerOptions['capture']
 * @param options.passive @see AddEventListenerOptions['passive']
 */
export function useEventListener<
  N extends string = string,
  T extends EventTarget = Window,
  E extends Event = GuessEvent<T, N>,
>(eventName: N, listener: Handler<E>, options: Options<T> = {}) {
  const { target = window, passive, capture } = options;

  // In fact, some developer usually wite code like this
  //
  // ```js
  // useEventListener('mousemove', (event) => {
  //   // TODO
  // });
  // ```
  //
  // Note that `listener` is a literal function, which means that it always be different function object reference.
  // As a dependency of useMemo/useEffect, passing in a different reference will be considered as an update.
  // Therefore, using the `listener` directly as dependency may result in a high frequency of compnent updates.
  //
  // This `handler` is the same reference in the same component instance.
  // Even if the passed `listener` is changed at a high frequency, the `handler` still not be changed.
  const ref = useRef<Handler<E>>();
  ref.current = listener;
  const handler = useCallback((e: Event) => {
    if (typeof ref.current !== 'function') return;
    ref.current(e as E);
  }, []);

  // Why put the addEventListener in useMemo rather than useEffect? Because the useEffect is executed too late.
  // If a listener is added after useEffect, some events may be missed, for example
  //
  // ```js
  // const obj = useMemo(() => new MyClass());
  // useEventListener('myevent', () => 'TODO', { target: obj });
  // ```
  //
  // MyClass may dispatch an initial event in the next tick, which is triggered before useEffect.
  useMemo(() => {
    target.addEventListener(eventName, handler, { passive, capture });
  }, [target, eventName, passive, capture]);

  useEffect(() => {
    return () => target.removeEventListener(eventName, handler, { capture });
  }, [target, eventName, passive, capture]);
}
