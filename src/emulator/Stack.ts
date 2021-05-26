/**
 * Stack of addresses that should be returned to after finishing a subroutine.
 */
export default class Stack {
  private stack = new Uint16Array(16);
  // Start the stack pointer at -1 so we can always increment it when pushing onto the stack.
  private pointer = -1;

  pop(): number {
    const value = this.stack[this.pointer] ?? 0;

    if (this.pointer > 0) {
      this.pointer -= 1;
    }

    return value;
  }

  push(value: number) {
    if (this.pointer < (this.stack.length - 1)) {
      this.pointer += 1;
    }

    this.stack[this.pointer] = value;
  }
}
