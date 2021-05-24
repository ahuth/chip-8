import Register from './Register';

/**
 * Stack of addresses that should be returned to after finishing a subroutine.
 */
export default class Stack {
  private stack = new Uint16Array(16);
  private pointer = new Register(8);

  pop(): number {
    const value = this.stack[this.pointer.get()] ?? 0;
    this.pointer.decrement();
    return value;
  }

  push(value: number) {
    this.pointer.increment();
    this.stack[this.pointer.get()] = value;
  }
}
