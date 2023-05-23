type Listener<T> = (value: T | undefined) => void;

export class Slot<T = unknown> {
  private readonly enties: { ref: unknown; value?: T }[];
  private readonly listeners: Listener<T>[];

  constructor() {
    this.enties = [];
    this.listeners = [];
  }

  public getLatest() {
    const { enties } = this;
    const latest = enties[enties.length - 1];
    if (latest) return latest.value;
  }

  public set(ref: unknown, value: T) {
    const { enties } = this;
    for (let i = 0; i < enties.length; i++) {
      if (enties[i].ref === ref) {
        enties[i].value = value;
        return;
      }
    }
    enties.push({ ref, value });
  }

  public get(ref: unknown) {
    const { enties } = this;
    for (let i = 0; i < enties.length; i++) {
      if (enties[i].ref === ref) return enties[i].value;
    }
  }

  public delete(ref: unknown) {
    const { enties } = this;
    for (let i = 0; i < enties.length; i++) {
      if (enties[i].ref === ref) {
        enties.splice(i, 1);
        return;
      }
    }
  }

  public on(handler: Listener<T>) {
    this.listeners.push(handler);
  }

  public off(handler: Listener<T>) {
    const { listeners } = this;
    const index = listeners.indexOf(handler);
    if (index !== -1) listeners.splice(index, 1);
  }

  public fire() {
    const { listeners } = this;
    if (listeners.length === 0) return;
    const value = this.getLatest();
    for (let i = 0; i < listeners.length; i++) {
      listeners[i](value);
    }
  }
}
