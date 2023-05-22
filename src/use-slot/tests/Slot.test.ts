import { Slot } from '../Slot';

test('basic', () => {
  const slot = new Slot();

  expect(slot.getLatest()).toBeUndefined();

  slot.set('a', 1);
  expect(slot.getLatest()).toBe(1);

  slot.set('b', 2);
  expect(slot.getLatest()).toBe(2);

  slot.set('c', 3);
  expect(slot.getLatest()).toBe(3);

  expect(slot.get('a')).toBe(1);
  expect(slot.get('b')).toBe(2);
  expect(slot.get('c')).toBe(3);

  slot.delete('b');
  expect(slot.getLatest()).toBe(3);

  slot.delete('c');
  expect(slot.getLatest()).toBe(1);

  slot.delete('a');
  expect(slot.getLatest()).toBeUndefined();
});
