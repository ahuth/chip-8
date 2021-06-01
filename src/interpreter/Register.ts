export type Register = ReturnType<typeof create>;

export function create(size: 8 | 16) {
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
