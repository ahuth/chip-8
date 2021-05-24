import Register from './Register';

/**
 * Stack of addresses that should be returned to after finishing a subroutine.
 */
export default class Stack {
  private stack = new Uint16Array(16);
  private pointer = new Register(8);

  constructor() {
    // Decrement the stack pointer (to a negative number), so we can always increment when pushing
    // and point to the right level of the stack.
    this.pointer.decrement();
  }

  pop(): number {
    const value = this.stack[this.pointer.get()] ?? 0;

    if (this.pointer.get() > 0) {
      this.pointer.decrement();
    }

    return value;
  }

  push(value: number) {
    if (this.pointer.get() < (this.stack.length - 1)) {
      this.pointer.increment();
    }

    this.stack[this.pointer.get()] = value;
  }
}
