import { DependencyList, ReactNode, useReducer, useRef } from 'react';
import { useEffect, useMemo } from 'react';
import { Slot } from './Slot';
import { useEventListener } from '../use-event-listener';

const computeIfAbsent = <K extends PropertyKey, V>(map: Record<K, V>, key: K, factory: (key: K) => V) => {
  if (!(key in map)) map[key] = factory(key);
  return map[key];
};

const hub = new EventTarget();
const storage: Record<PropertyKey, Slot> = Object.create(null);

const SET_SLOT = 3;
const GET_SLOT = 1;

/**
 * Read the slot content. you can set content by `useSlot(name, factory, deps)`.
 * @param name slot name
 */
export function useSlot(name: string): ReactNode;

/**
 * Set the slot content and notify all references update in realtime.
 * content may rollback to previous state when current component unmounted.
 * @param name slot name
 * @param factory content factory
 * @param deps dependencies
 */
export function useSlot(name: string, factory: () => ReactNode, deps: DependencyList): void;

export function useSlot(...args: [string] | [string, () => ReactNode, DependencyList]) {
  const [name, factory, deps = []] = args;
  const { length } = args;
  const slot = computeIfAbsent(storage, name, () => new Slot());
  const ref = useRef();

  useMemo(() => {
    if (length === SET_SLOT && typeof factory === 'function') {
      slot.set(ref, factory());
    }
  }, [length, slot, ...deps]);

  useEffect(() => {
    if (length === SET_SLOT && typeof factory === 'function') {
      hub.dispatchEvent(new CustomEvent(name));
    }
  }, [length, name, ...deps]);

  useEffect(() => {
    if (length === SET_SLOT) {
      return () => {
        slot.delete(ref);
        hub.dispatchEvent(new CustomEvent(name));
      };
    }
  }, [length, name, slot, length]);

  const [current, updateCurrent] = useReducer(slot.getLatest, null, slot.getLatest);
  useEventListener(name, updateCurrent, { target: hub });

  if (length === GET_SLOT) return current;
  if (length === SET_SLOT) return undefined;

  throw new TypeError(`Failed to execute 'useSlot': 1 or 3 arguments required, but ${length} present.`);
}
