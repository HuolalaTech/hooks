import { DependencyList, ReactNode, useRef, useState } from 'react';
import { useEffect, useMemo } from 'react';
import { Slot } from './Slot';

const computeIfAbsent = <K extends PropertyKey, V>(map: Record<K, V>, key: K, factory: (key: K) => V) => {
  if (!(key in map)) map[key] = factory(key);
  return map[key];
};

const storage: Record<PropertyKey, Slot<ReactNode>> = Object.create(null);

/**
 * Read the slot content. You can set content using `useSlotWritter(name, factory, deps)`.
 * @param name slot identifier
 */
export const useSlot = (name: PropertyKey) => {
  const slot = computeIfAbsent(storage, name, () => new Slot());
  const [value, updateValue] = useState(() => slot.getLatest());

  useMemo(() => {
    slot.on(updateValue);
  }, [slot]);

  useEffect(() => {
    return () => slot.off(updateValue);
  }, [slot]);

  return value;
};

/**
 * Set the slot content and notify all references update in realtime.
 * When the current component unmounted, all content may rollback to previous state.
 * @param name slot identifier
 * @param factory content factory
 * @param deps dependencies
 */
export const useSlotWriter = (name: PropertyKey, factory: () => ReactNode, deps: DependencyList) => {
  const slot = computeIfAbsent(storage, name, () => new Slot());
  const ref = useRef();

  useMemo(() => {
    slot.set(ref, factory());
  }, [slot, ...deps]);

  useEffect(() => {
    slot.fire();
  }, [slot, ...deps]);

  useEffect(() => {
    return () => {
      slot.delete(ref);
      slot.fire();
    };
  }, [slot]);
};
