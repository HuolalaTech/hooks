export class Slot {
  private readonly enties = [] as { ref: unknown; value?: unknown }[];

  public readonly getLatest = () => {
    const { enties } = this;
    const latest = enties[enties.length - 1];
    if (latest) return latest.value;
  };

  public set(ref: unknown, value: unknown) {
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
}
