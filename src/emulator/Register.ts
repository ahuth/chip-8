export default class Register {
  /** Register size in bits. */
  size: number;
  /** Value currenly held in the register. */
  value = 0;

  constructor(size: number) {
    this.size = size;
  }

  increment(by = 1) {
    this.value = (this.value + by) % this.size;
  }

  decrement() {
    this.increment(-1);
  }

  set(value: number) {
    if (value > (2 ** this.size)) {
      throw new Error(`Value too large for ${this.size}-bit register`);
    }
    this.value = value;
  }
}
