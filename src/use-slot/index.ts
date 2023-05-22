import type { DependencyList, ReactNode, RefObject } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

class DMap<K, K2, V> {
  private readonly map;
  constructor() {
    this.map = new Map<K, Map<K2, V>>();
  }
  get(key: K) {
    if (!this.map.has(key)) this.map.set(key, new Map<K2, V>());
    const set = this.map.get(key);
    if (!set) throw new Error(); // never
    return set;
  }
  getLatestValue(key: K) {
    const map = this.get(key);
    const it = map.values();
    let lastValue: V | null = null;
    for (;;) {
      const { done, value = null } = it.next();
      if (done) break;
      lastValue = value;
    }
    return lastValue;
  }
}

const hub = new EventTarget();
const storage = new DMap<string, unknown, ReactNode>();

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

  const ref: RefObject<unknown> = useRef({});
  const defaultValue = useMemo(() => {
    const value = storage.getLatestValue(name);
    if (length === 3) storage.get(name).set(ref.current, value);
    return value;
  }, [name, length]);

  const [current, setCurrent] = useState(defaultValue);

  useEffect(() => {
    const ins = ref.current;
    const update = () => {
      setCurrent(storage.getLatestValue(name));
    };
    if (length === 1) {
      hub.addEventListener(name, update);
      update();
    }
    if (length === 3 && typeof factory === 'function') {
      const detail = factory();
      storage.get(name).set(ins, detail);
      hub.dispatchEvent(new CustomEvent(name));
    }
    return () => {
      storage.get(name).delete(ins);
      if (length === 1) hub.removeEventListener(name, update);
      if (length === 3) hub.dispatchEvent(new CustomEvent(name));
    };
  }, [name, length, ...deps]);

  if (length === 1) return current;
  if (length === 3) return undefined;

  throw new TypeError(`Failed to execute 'useSlot': 1 or 3 arguments required, but ${length} present.`);
}
