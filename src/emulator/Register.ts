export type Register = {
  readonly maxValue: number,
  readonly size: 8 | 16,
  value: number,
}

export function create(size: 8 | 16): Register {
  return {
    maxValue: 2 ** size,
    size,
    value: 0,
  };
}

export function set(register: Register, value: number): void {
  register.value = value % register.maxValue;
}

export function get(register: Register): number {
  return register.value;
}
