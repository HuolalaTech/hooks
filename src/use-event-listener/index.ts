import { useCallback, useEffect, useMemo, useRef } from 'react';

interface Options extends Omit<AddEventListenerOptions, 'once'> {
  target?: EventTarget;
}

type Handler<E extends Event> = (e: E) => void;

/**
 * Bind event listener on whole component lifecycle
 * @param options.target The event target, defaults window object
 * @param options.capture @see AddEventListenerOptions['capture']
 * @param options.passive @see AddEventListenerOptions['passive']
 */
export function useEventListener<E extends Event = Event>(
  eventName: string,
  listener: Handler<E>,
  options: Options = {},
) {
  const { target = window, passive, capture } = options;
  const ref = useRef<Handler<E>>();
  ref.current = listener;
  const handler = useCallback((e: Event) => {
    if (!ref.current) return;
    ref.current(e as E);
  }, []);
  useMemo(() => {
    target?.addEventListener(eventName, handler, { passive, capture });
  }, [target, eventName, passive, capture]);
  useEffect(() => {
    return () => {
      target?.removeEventListener(eventName, handler, { capture });
    };
  }, [target, eventName, passive, capture]);
}
