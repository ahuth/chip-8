/**
 * Memory (4KB)
 *
 * - 0x000 to 0x1FF is reserved for the interpreter.
 * - 0x200 is where most Chip-8 programs start.
 * - 0x600 is where ETI 660 Chip-8 programs start.
 * - 0xFFF is the end of RAM.
 */
export default class Memory {
  data = new Uint8Array(0xFFF);

  /**
   * Read 1 byte from memory.
   * @param address 12-bit memory address from 0x200 to 0xFFF.
   * @returns 1 byte
   */
  read1(address: number): number {
    return this.data[address];
  }

  /**
   * Read 2 bytes from memory.
   * @param address 12-bit memory address from 0x200 to 0xFFF.
   * @returns 2 bytes
   */
  read2(address: number): number {
    // Chip-8 is "big endian", I think, so the most significant byte is first.
    const hi = this.read1(address);
    const lo = this.read1(address + 1);
    // Combine the most and least significant bytes into a single 2-byte number.
    return (hi << 8) | lo;
  }

  /**
   * Write 1 byte to memory.
   * @param address 12-bit memory address from 0x200 to 0xFFF.
   * @param data 1 byte of data.
   */
  write1(address: number, data: number): void {
    this.data[address] = data;
  }

  /**
   * Write 2 bytes of memory.
   * @param address 12-bit memory address from 0x200 to 0xFFF.
   * @param data 2 bytes of data.
   */
  write2(address: number, data: number): void {
    // Split apart the data into hi and low bytes.
    const hi = data >> 8;
    const lo = data & 0xFF;
    this.write1(address, hi);
    this.write1(address + 1, lo);
  }

  /**
   * Load data into memory. Normally the loaded data will start at 0x200, because 0-0x1FF is
   * reserved for the interpreter.
   */
  load(data: number[], start = 0x200): void {
    this.data.set(data, start);
  }
}
