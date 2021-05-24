export default class Register {
  /** Register size in bits. */
  private size: 8 | 16;
  /** Value currenly held in the register. */
  private value = 0;
  /** Max value the register can hold. */
  private maxValue: number;

  constructor(size: 8 | 16) {
    this.size = size;
    this.maxValue = 2**this.size;
  }

  increment(by = 1) {
    this.value = (this.value + by) % this.maxValue;
  }

  decrement() {
    this.increment(-1);
  }

  set(value: number) {
    if (value > this.maxValue) {
      throw new Error(`Value too large for ${this.size}-bit register`);
    }
    this.value = value;
  }

  get() {
    return this.value;
  }
}
