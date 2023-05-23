import { DependencyList, ReactNode, useReducer, useRef } from 'react';
import { useEffect, useMemo } from 'react';
import { Slot } from './Slot';
import { useEventListener } from '../use-event-listener';

const computeIfAbsent = <K extends PropertyKey, V>(map: Record<K, V>, key: K, factory: (key: K) => V) => {
  if (!(key in map)) map[key] = factory(key);
  return map[key];
};

const hub = new EventTarget();
const storage: Record<PropertyKey, Slot<ReactNode>> = Object.create(null);

/**
 * Read the slot content. You can set content using `useSlotWritter(name, factory, deps)`.
 * @param name slot name
 */
export const useSlot = (name: string) => {
  const slot = computeIfAbsent(storage, name, () => new Slot());
  const [current, updateCurrent] = useReducer(slot.getLatest, null, slot.getLatest);
  useEventListener(name, updateCurrent, { target: hub });
  return current;
};

/**
 * Set the slot content and notify all references update in realtime.
 * When the current component unmounted, all content may rollback to previous state.
 * @param name slot name
 * @param factory content factory
 * @param deps dependencies
 */
export const useSlotWriter = (name: string, factory: () => ReactNode, deps: DependencyList) => {
  const slot = computeIfAbsent(storage, name, () => new Slot());
  const ref = useRef();

  useMemo(() => {
    slot.set(ref, factory());
  }, [slot, ...deps]);

  useEffect(() => {
    hub.dispatchEvent(new CustomEvent(name));
  }, [name, ...deps]);

  useEffect(() => {
    return () => {
      slot.delete(ref);
      hub.dispatchEvent(new CustomEvent(name));
    };
  }, [name, slot, length]);
};
